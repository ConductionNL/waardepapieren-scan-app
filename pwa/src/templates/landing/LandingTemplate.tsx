import * as React from "react";
import * as styles from "./LandingTemplate.module.css";
import { Page, PageContent } from "@utrecht/component-library-react/dist/css-module";

export const LandingTemplate: React.FC = () => {
  return (
    <Page>
      <PageContent className={styles.container}>
        <span>Hello World!</span>
      </PageContent>
    </Page>
  );
};
