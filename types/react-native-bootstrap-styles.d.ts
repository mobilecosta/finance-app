declare module "react-native-bootstrap-styles" {
  import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from "react-native";

  type Constants = Record<string, any>;
  type AnyStyle = ViewStyle | TextStyle | ImageStyle;
  type BSStyles = Record<string, any>;

  class BootstrapStyleSheet {
    s: BSStyles;
    c: Constants;
    styles: BSStyles;
    constants: Constants;
    DIMENSIONS_WIDTH: number;
    DIMENSIONS_HEIGHT: number;
    DIMENSIONS_MAX: number;
    ORIENTATION_PORTRAIT: boolean;
    ORIENTATION_LANDSCAPE: boolean;
    MODE_LIGHT: boolean;
    MODE_DARK: boolean;

    constructor(constants?: Record<string, any>, classes?: Record<string, any> | ((c: Constants, classes: Record<string, any>) => Record<string, any>));

    addDimensionsListener(handler: (dimensions: { width: number; height: number }) => void): void;
    removeDimensionsListener(handler: (dimensions: { width: number; height: number }) => void): void;
    addOrientationListener(handler: (dimensions: { width: number; height: number }) => void): void;
    removeOrientationListener(handler: (dimensions: { width: number; height: number }) => void): void;
    addModeListener(handler: (mode: { colorScheme: string }) => void): void;
    removeModeListener(handler: (mode: { colorScheme: string }) => void): void;
  }

  export default BootstrapStyleSheet;
}
