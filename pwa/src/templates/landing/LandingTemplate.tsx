import * as React from "react";
import * as styles from "./LandingTemplate.module.css";
import Skeleton from "react-loading-skeleton";
import { Page, PageContent } from "@utrecht/component-library-react/dist/css-module";
import { QrReader } from "react-qr-reader";
import { navigate } from "gatsby";

export const LandingTemplate: React.FC = () => {
  const [data, setData] = React.useState<boolean>(false);

  return (
    <Page>
      <PageContent className={styles.container}>
        {!data && (
          <QrReader
            onResult={(result, error) => {
              if (!!result) {
                setData(true);
                const qrData: any = result;
                navigate(`/${qrData.text}`);
              }
            }}
            constraints={{ facingMode: "environment" }}
          />
        )}

        {data && (
          <>
            <span>Redirecting</span> <Skeleton height="200px" />
          </>
        )}
      </PageContent>
    </Page>
  );
};
