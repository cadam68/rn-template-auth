import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import LogService from "../util/LogService";
import FetchService from "../util/FetchService";
import { UTILS } from "../util/tools";

const logger = LogService.Log("AppContext");

const AppContext = createContext({
  basicDataService: {
    basicData: undefined,
    loadBasicData: async () => {},
  },
  portfolioService: {
    portfolio: undefined,
    portfolioId: undefined,
    setPortfolioId: () => {},
  },
  debugService: {
    debug: false,
    toggle: () => {},
  },
});

const AppContextProvider = ({ children }) => {
  const [basicData, setBasicData] = useState();
  const [portfolio, setPortfolio] = useState();
  const [portfolioId, setPortfolioId] = useState();
  const [debug, setDebug] = useState(false);

  const loadBasicData = async () => {
    const data = await FetchService.fetchLoadBasicData();
    setBasicData(data);
  };

  // load portfolio
  useEffect(() => {
    const abortCtrl = new AbortController();

    if (!portfolioId) return;
    (async pid => {
      try {
        logger.info(`loading portfolio for userId ${pid}`);
        await UTILS.wait(1); // iici- to be implemented according to business request -
        const portfolioData = {};
        setPortfolio(portfolioData);
      } catch (e) {
        if (e.message) logger.error(e.message);
        setPortfolio(undefined);
      }
    })(portfolioId);

    return () => abortCtrl.abort();
  }, [portfolioId]);

  const contextValues = useMemo(
    () => ({
      basicDataService: { basicData, loadBasicData },
      portfolioService: { portfolio, portfolioId, setPortfolioId },
      debugService: { debug, toggle: () => setDebug(prevState => !prevState) },
    }),
    [basicData, portfolioId, portfolio, debug]
  );

  return <AppContext.Provider value={contextValues}>{children}</AppContext.Provider>;
};

// Custom hook to consume the AppContext
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppContextProvider");
  }
  return context;
};

export default AppContextProvider;
