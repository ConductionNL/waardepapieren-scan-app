import * as React from "react";
import _ from "lodash";
import "../styling/index.css";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { languageOptions } from "../data/languageOptions";

export const Head: React.FC = () => {
  const { i18n } = useTranslation();


  const currentLanguage = languageOptions.find(
    (language) => language.label === (i18n.language.toUpperCase() === "EN" ? "US" : i18n.language.toUpperCase()),
  )?.value;

  return (
    <Helmet
      htmlAttributes={{
        lang: currentLanguage,
      }}
      bodyAttributes={{
        class: window.sessionStorage.getItem("NL_DESIGN_THEME_CLASSNAME"),
      }}
    >
      <title>{`Scanner | ${window.sessionStorage.getItem("ORGANISATION_NAME")}`}</title>
      <link rel="icon" type="svg" href={window.sessionStorage.getItem("FAVICON_URL") ?? ""} />
    </Helmet>
  );
};
