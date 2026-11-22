/* Checks the localization contract without React Native or a running API. */
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const assert = require("node:assert/strict");
const ts = require("typescript");
const root = path.resolve(__dirname, "..");
const cache = new Map();
function load(relative) {
  const filename = path.join(root, "src", relative + ".ts");
  if (cache.has(filename)) return cache.get(filename).exports;
  const mod = new Module(filename, module);
  mod.filename = filename;
  mod.paths = Module._nodeModulePaths(path.dirname(filename));
  const original = mod.require.bind(mod);
  mod.require = (name) =>
    name.startsWith(".")
      ? load(
          path.relative(
            path.join(root, "src"),
            path.resolve(path.dirname(filename), name),
          ),
        )
      : original(name);
  cache.set(filename, mod);
  mod._compile(
    ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        esModuleInterop: true,
      },
    }).outputText,
    filename,
  );
  return mod.exports;
}
(async () => {
  const ja = load("i18n/locales/ja").default;
  const en = load("i18n/locales/en").default;
  const i18n = load("i18n/index").default;
  const { sourceText, sourceFormat } = load("i18n/source");
  const { tText, translateText } = load("i18n/display");
  assert.equal(i18n.language, "ja");
  assert.deepEqual(
    Object.keys(en.messages).sort(),
    Object.keys(ja.messages).sort(),
  );
  for (const [key, japanese] of Object.entries(ja.messages)) {
    assert.equal(typeof en.messages[key], "string", key);
    assert.ok(
      !/[ぁ-んァ-ヶ一-龯]/.test(en.messages[key]),
      "Untranslated English: " + key,
    );
    const slots = (text) => (text.match(/\{\{\w+\}\}/g) || []).sort();
    assert.deepEqual(
      slots(en.messages[key]),
      slots(japanese),
      "Interpolation mismatch: " + key,
    );
  }
  const canonical = sourceText("jobOffer");
  assert.equal(canonical, "内定");
  await i18n.changeLanguage("en");
  assert.equal(
    sourceText("jobOffer"),
    canonical,
    "API/domain values must not change with the locale",
  );
  assert.equal(tText("cancel"), "Cancel");
  assert.equal(translateText("内定 → 内定辞退"), "Job offer → Offer declined");
  assert.equal(
    translateText("ログインしてください。"),
    tText(
      Object.keys(ja.messages).find(
        (k) => ja.messages[k] === "ログインしてください。",
      ),
    ),
  );
  assert.equal(
    translateText("Example text not in the catalog"),
    "Example text not in the catalog",
  );
  const greetingKey = Object.keys(ja.messages).find(
    (k) => ja.messages[k] === "{{v0}}のアカウント",
  );
  const username = sourceText("cancel"); // User content coinciding with a UI label must stay intact.
  assert.equal(
    translateText(sourceFormat(greetingKey, { v0: username }, ["v0"])),
    en.messages[greetingKey].replace("{{v0}}", username),
  );
  await i18n.changeLanguage("ja");
  assert.equal(tText("cancel"), "キャンセル");
  console.log(
    `PASS: ${Object.keys(ja.messages).length} bilingual messages, placeholders, default locale, domain values, and protected interpolation`,
  );
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
