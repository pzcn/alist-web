import {
  Center,
  HopeProvider,
  NotificationsProvider,
  Spinner,
} from "@hope-ui/solid";
import { I18nContext } from "@solid-primitives/i18n";
import { ErrorBoundary, JSXElement, Suspense } from "solid-js";
import { Error, FullLoading } from "~/components";
import App from "./App";
import { i18n } from "./i18n";
import { globalStyles, theme } from "./theme";

const Index = () => {
  globalStyles();
  return (
    <HopeProvider config={theme}>
      <ErrorBoundary
        fallback={(err) => {
          console.error("error", err);
          return <Error msg={`System error: ${err.message}`} />;
        }}
      >
        <I18nContext.Provider value={i18n}>
          <NotificationsProvider duration={3000}>
            <Suspense fallback={<FullLoading />}>
              <App />
            </Suspense>
          </NotificationsProvider>
        </I18nContext.Provider>
      </ErrorBoundary>
    </HopeProvider>
  );
};

export { Index };
