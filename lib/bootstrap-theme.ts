import BootstrapStyleSheet from "react-native-bootstrap-styles";
import { useState, useEffect } from "react";

const constants = {
  PRIMARY: "#0a7ea4",
  SUCCESS: "#10B981",
  DANGER: "#EF4444",
  WARNING: "#F59E0B",
  INFO: "#0a7ea4",
  SECONDARY: "#687076",
  LIGHT: "#f8f9fa",
  DARK: "#212529",
  WHITE: "#ffffff",
  BODY_BG: "#ffffff",
  BODY_COLOR: "#212529",
  BORDER_COLOR: "#E5E7EB",
  ENABLE_ROUNDED: true,
  ENABLE_SHADOWS: true,
  REM: 16,
};

const customClasses = (c: any, classes: any) => ({
  financeBackground: {
    backgroundColor: c.BODY_BG,
  },
  financeSurface: {
    backgroundColor: "#f5f5f5",
  },
  financeText: {
    color: c.BODY_COLOR,
  },
  financeMuted: {
    color: c.SECONDARY,
  },
  financeBorder: {
    borderColor: c.BORDER_COLOR,
  },
  incomeText: {
    color: c.SUCCESS,
  },
  expenseText: {
    color: c.DANGER,
  },
  primaryText: {
    color: c.PRIMARY,
  },
  badge: {
    paddingHorizontal: c.REM * 0.5,
    paddingVertical: c.REM * 0.2,
    borderRadius: c.REM * 0.25,
    alignSelf: "flex-start",
  },
  badgePill: {
    borderRadius: c.ROUNDED_PILL,
  },
  badgeText: {
    fontSize: c.FONT_SIZE_SM,
    fontWeight: c.FONT_WEIGHT_BOLD,
  },
  fabButton: {
    position: "absolute",
    right: c.REM,
    bottom: c.REM,
    width: c.REM * 3.5,
    height: c.REM * 3.5,
    borderRadius: c.REM * 1.75,
    backgroundColor: c.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: c.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  fabButtonText: {
    color: c.WHITE,
    fontSize: c.REM * 1.5,
    fontWeight: c.FONT_WEIGHT_BOLD,
  },
  tabBar: {
    borderTopWidth: c.BORDER_WIDTH,
    borderTopColor: c.BORDER_COLOR,
    backgroundColor: c.BODY_BG,
    paddingTop: c.REM * 0.4,
    paddingBottom: c.REM * 0.4,
    height: c.REM * 3.6,
  },
  tabBarItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tableHeader: {
    backgroundColor: c.LIGHT,
    borderBottomWidth: c.BORDER_WIDTH,
    borderBottomColor: c.BORDER_COLOR,
    paddingVertical: c.REM * 0.5,
    paddingHorizontal: c.REM * 0.5,
  },
  tableHeaderText: {
    color: c.SECONDARY,
    fontWeight: c.FONT_WEIGHT_BOLD,
    fontSize: c.FONT_SIZE_SM,
  },
  tableRow: {
    borderBottomWidth: c.BORDER_WIDTH,
    borderBottomColor: c.BORDER_COLOR,
    paddingVertical: c.REM * 0.6,
    paddingHorizontal: c.REM * 0.5,
  },
  tableCellText: {
    fontSize: c.FONT_SIZE_SM,
    color: c.BODY_COLOR,
  },
});

const bootstrapStyleSheet = new BootstrapStyleSheet(
  constants,
  customClasses,
);

export const { s, c } = bootstrapStyleSheet;

export function useBootstrapStyles() {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const handler = () => forceUpdate((n) => n + 1);
    bootstrapStyleSheet.addDimensionsListener(handler);
    bootstrapStyleSheet.addOrientationListener(handler);
    return () => {
      bootstrapStyleSheet.removeDimensionsListener(handler);
      bootstrapStyleSheet.removeOrientationListener(handler);
    };
  }, []);

  return { s, c };
}

export default bootstrapStyleSheet;
