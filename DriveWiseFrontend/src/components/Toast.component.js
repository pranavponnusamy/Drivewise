import Toast from "react-native-toast-message";
import { heightPercentageToDP } from "react-native-responsive-screen";

export const createToast = (type = "success", text1 = "", text2 = "") => {
  return Toast.show({
    type,
    position: "top",
    text1,
    text2,
    topOffset: heightPercentageToDP("7%"),
    visibilityTime: 3000,
  });
};
