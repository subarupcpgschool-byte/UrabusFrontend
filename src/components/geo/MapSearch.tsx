import { sourceText } from "@/i18n/source";
import { tText, useLocaleVersion } from "@/i18n/display";
import { Pressable, Text } from "@/i18n/native";
import { AppSwitch } from "@/components/form";
import { useState } from "react";
import { View, Platform } from "react-native";
import Slider from "@react-native-community/slider";
import * as Location from "expo-location";
import GeoMap from "./GeoMap";
import type { SearchArea } from "./types";
export const INITIAL_AREA: SearchArea = {
  latitude: 34.6937,
  longitude: 135.5023,
  radiusKm: 5,
};
export default function MapSearch({
  value,
  onChange,
}: {
  value?: SearchArea;
  onChange: (area: SearchArea | undefined) => void;
}) {
  "use no memo";
  useLocaleVersion();
  const [draft, setDraft] = useState(INITIAL_AREA);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const area = value ?? draft;
  const change = (next: SearchArea) => {
    setDraft(next);
    onChange(next);
  };
  const locate = async () => {
    setBusy(true);
    setError("");
    try {
      if (Platform.OS === "web") {
        if (!navigator.geolocation)
          throw new Error(sourceText("thisBrowserDoesNotSupportGeolocation"));
        const p = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
          }),
        );
        change({
          ...area,
          latitude: p.coords.latitude,
          longitude: p.coords.longitude,
        });
      } else {
        const permission = await Location.requestForegroundPermissionsAsync();
        if (permission.status !== "granted")
          throw new Error(sourceText("allowAccessToYourLocation"));
        const p = await new Promise<Location.LocationObject>(
          (resolve, reject) => {
            const timer = setTimeout(() => reject(new Error("timeout")), 15000);
            Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            })
              .then(resolve, reject)
              .finally(() => clearTimeout(timer));
          },
        );
        change({
          ...area,
          latitude: p.coords.latitude,
          longitude: p.coords.longitude,
        });
      }
    } catch {
      setError(sourceText("unableToGetYourLocationCheckLocation"));
    } finally {
      setBusy(false);
    }
  };
  return (
    <View style={{ gap: 8 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontWeight: "700" }}>{tText("mapSearch")}</Text>
        <AppSwitch
          accessibilityLabel={tText("enableMapSearch")}
          value={!!value}
          onValueChange={(enabled) => onChange(enabled ? draft : undefined)}
        />
      </View>
      {!!value && (
        <>
          <Text>
            {tText("searchRadius")}
            {area.radiusKm.toFixed(1)} km
          </Text>
          <Slider
            accessibilityLabel={tText("searchRadiusFrom0To10Kilometers")}
            minimumValue={0}
            maximumValue={10}
            step={0.1}
            value={area.radiusKm}
            onValueChange={(radiusKm) => change({ ...area, radiusKm })}
            minimumTrackTintColor="#159A69"
          />
          <Pressable
            disabled={busy}
            onPress={locate}
            style={{ padding: 10, borderRadius: 8, backgroundColor: "#E8F5EE" }}
          >
            <Text style={{ color: "#13794E", textAlign: "center" }}>
              {busy
                ? sourceText("gettingYourLocation")
                : sourceText("useMyLocation")}
            </Text>
          </Pressable>
          {!!error && (
            <Text accessibilityRole="alert" style={{ color: "#B42318" }}>
              {error}
            </Text>
          )}
          <GeoMap
            area={area}
            onCenter={(latitude, longitude) =>
              change({ ...area, latitude, longitude })
            }
          />
          <Text style={{ color: "#737B85", fontSize: 11 }}>
            {tText("tapTheMapToSetTheSearch")}
          </Text>
        </>
      )}
    </View>
  );
}
