import { useState, useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";

const usePreventAutoHide = callback => {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await SplashScreen.preventAutoHideAsync(); // Ensure splash screen stays visible
        await callback(); // Execute the callback for resource loading
      } catch (error) {
        console.warn("Error loading resources:", error);
      } finally {
        setIsAppReady(true);
        await SplashScreen.hideAsync(); // Hide the splash screen once loading is complete
      }
    })();
  }, []);

  return isAppReady;
};

export default usePreventAutoHide;
