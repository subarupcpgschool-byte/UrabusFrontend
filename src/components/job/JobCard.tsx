import { COLORS } from "@/theme/GlobalWorkersStyles";
import { baseStyle, layoutFixStyle, textStyle } from "@/theme/responsiveStyle";
import { Ionicons } from "@expo/vector-icons";
import { GestureResponderEvent, Pressable, Text, View } from "react-native";
import CommonButton from "../common/CommonButton";
import JobBadge from "./JobBadge";
import JobMeta from "./JobMeta";

export type JobCardProps = {
  clickFavoriteAction: (event: GestureResponderEvent) => void;
  clickDetailAction: (event: GestureResponderEvent) => void;
  clickApplyAction: (event: GestureResponderEvent) => void;
  width: number;
};

export type JobData = {
  company: CompanyData;
};

export type CompanyData = {
  id: number;
  name: string;
  picUrl: string;
};
export type JobDetailData = {};

export default function JobCard({
  clickFavoriteAction,
  clickDetailAction,
  clickApplyAction,
  width,
}: JobCardProps) {
  const s = (...names: string[]) => baseStyle(names, width) as never;
  const text = (...names: string[]) => textStyle(names, width);
  const lx = (classes: readonly string[]) => layoutFixStyle(classes, width);
  return (
    <View style={[s("jobCard"), lx(["job-card"])]}>
      <View style={[s("jobCardHead"), lx(["job-card-head"])]}>
        <View style={[s("companyAvatar"), lx(["company-avatar"])]}>
          <Text>{"合"}</Text>
        </View>
        <View style={undefined}>
          <Text style={text("h3", "jobCardHeadH3")}>{"Webデザイナー"}</Text>
          <Text style={text("p", "jobCardHeadP")}>{"合同会社ノード"}</Text>
        </View>
        <Pressable
          onPress={clickFavoriteAction}
          style={({ pressed }) => [
            [s("iconBtn", "jobCardHeadIconBtn"), lx(["icon-btn"])],
            pressed && { opacity: 0.72 },
          ]}
        >
          <Ionicons name="bookmark-outline" size={16} color={COLORS.blue} />
        </Pressable>
      </View>
      <View style={[s("jobMeta"), lx(["job-meta"])]}>
        <JobMeta
          message="大阪府／週3リモート"
          width={width}
          icon={{ name: "ellipse-outline", color: "muted" }}
        />
        <JobMeta
          message="業務委託"
          width={width}
          icon={{ name: "ellipse-outline", color: "muted" }}
        />
        <JobMeta
          message="評価 4.6"
          width={width}
          icon={{ name: "ellipse-outline", color: "muted" }}
        />
      </View>
      <View style={[s("jobPay"), lx(["job-pay"])]}>
        <Text>{"時給 2,500円〜"}</Text>
      </View>
      <View style={[s("tagRow"), lx(["tag-row"])]}>
        <JobBadge message="未経験OK" color="blue" />
        <JobBadge message="副業可" color="purple" />
        <JobBadge message="評価率90%以上" color="green" />
      </View>
      <View style={[s("jobActions"), lx(["job-actions"])]}>
        <CommonButton
          message={{ text: "詳細を見る", color: "white" }}
          icon={{ name: "eye-outline", color: "blue" }}
          addStyles={{ s: ["flex1"], lx: [] }}
          width={width}
        />
        <CommonButton
          message={{ text: "応募する", color: "primary" }}
          icon={{ name: "briefcase-outline", color: "white" }}
          btn={{ color: "primary" }}
          addStyles={{ s: ["flex1"], lx: [] }}
          width={width}
        />
      </View>
    </View>
  );
}
