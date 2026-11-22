import { translateText } from "@/i18n/display";
import { sourceText } from "@/i18n/source";
import { tText, useLocaleVersion } from "@/i18n/display";
import { Pressable, Text } from "@/i18n/native";
import { useAuth } from "@/auth/AuthProvider";
import { useEffect, useState } from "react";
import { Image, Linking, View } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import type { Attachment } from "./WorkspaceProvider";
import { resolveAttachment, releaseAttachment } from "./attachments";
function Video({ uri }: { uri: string }) {
  "use no memo";
  useLocaleVersion();
  const player = useVideoPlayer(uri);
  return (
    <VideoView
      player={player}
      nativeControls
      allowsFullscreen
      contentFit="contain"
      style={{ width: 240, maxWidth: "100%", height: 160, borderRadius: 9 }}
    />
  );
}
export function AttachmentView({ attachment }: { attachment: Attachment }) {
  "use no memo";
  useLocaleVersion();
  const { token } = useAuth();
  const [uri, setUri] = useState(""),
    [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    let current = "";
    setUri("");
    setError("");
    if (!token) return;
    resolveAttachment(attachment, token)
      .then((value) => {
        current = value;
        if (active) setUri(value);
        else releaseAttachment(value);
      })
      .catch(() => {
        if (active) setError(sourceText("unableToLoadTheFile"));
      });
    return () => {
      active = false;
      if (current) releaseAttachment(current);
    };
  }, [attachment.id, token]);
  return (
    <View style={{ gap: 6, maxWidth: "100%" }}>
      {error ? (
        <Text>{error}</Text>
      ) : !uri ? (
        <Text>{tText("loading")}</Text>
      ) : (
        <>
          {attachment.mime.startsWith("image/") ? (
            <Image
              source={{ uri }}
              resizeMode="contain"
              style={{
                width: 240,
                maxWidth: "100%",
                height: 160,
                borderRadius: 9,
              }}
            />
          ) : attachment.mime.startsWith("video/") ? (
            <Video uri={uri} />
          ) : null}
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              void Linking.openURL(uri).catch(() =>
                setError(sourceText("thisDeviceCannotOpenTheFile")),
              );
            }}
          >
            <Text
              style={{ color: "#1748b8", textDecorationLine: "underline" }}
              numberOfLines={2}
            >
              📎 {attachment.name}（
              {attachment.size < 1024 * 1024
                ? `${translateText(Math.max(1, Math.ceil(attachment.size / 1024)))} KB`
                : `${translateText((attachment.size / 1024 / 1024).toFixed(1))} MB`}
              ）
            </Text>
          </Pressable>
        </>
      )}
    </View>
  );
}
