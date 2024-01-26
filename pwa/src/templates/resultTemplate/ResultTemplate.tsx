import * as React from "react";
import * as styles from "./ResultTemplate.module.css";
import * as jose from "jose";
import clsx from "clsx";
import { Page, PageContent } from "@utrecht/component-library-react/dist/css-module";
import { Code, Heading1, Paragraph } from "@utrecht/component-library-react";
import { CardHeader, CardHeaderTitle, CardWrapper } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { TableResultsTemplate } from "../tableResultTemplate/TableResultsTemplate";
import Skeleton from "react-loading-skeleton";

interface ResultTemplateProps {
  id: string;
}

export const ResultTemplate: React.FC<ResultTemplateProps> = ({ id }) => {
  const { t } = useTranslation();
  const [token, setToken] = React.useState<any>("");
  const [data, setData] = React.useState<any>("");
  const [result, setResult] = React.useState<boolean>();
  const [keyFormat, setKeyFormat] = React.useState<"x509" | "spki">("x509");
  const [algorithm, setAlgorithm] = React.useState<"RS512" | "ES256">("RS512");

  const key = window.sessionStorage.getItem("PUBLIC_KEY") ?? "";

  const getKeyFormat = () => {
    if (!key) return;
    if (key.includes("-----BEGIN CERTIFICATE-----")) {
      setKeyFormat("x509");
      setAlgorithm("RS512");
    }
    if (key.includes("-----BEGIN PUBLIC KEY-----")) {
      setKeyFormat("spki");
      setAlgorithm("ES256");
    }
  };

  React.useEffect(() => {
    getKeyFormat();
  }, []);

  React.useEffect(() => {
    async function getToken() {
      switch (keyFormat) {
        case "x509":
          const x509Key = await jose.importX509(key, algorithm);
          setToken(x509Key);
          break;
        case "spki":
          const spkiKey = await jose.importSPKI(key, algorithm);
          setToken(spkiKey);
          break;
      }
    }

    if (!token) {
      getToken().catch((err) => (setResult(false), setData(err.message)));
    }
  });

  React.useEffect(() => {
    if (!token) return;

    async function getVerification() {
      const { payload } = await jose.jwtVerify(id, token);
      setData(payload);
      setResult(true);
    }
    if (!result) {
      getVerification().catch((err) => (setResult(false), setData(err.message)));
    }
  }, [token]);

  return (
    <Page>
      <PageContent className={styles.container}>
        {data && (
          <CardWrapper className={clsx(styles.cardContainer, result ? styles.success : styles.fail)}>
            <CardHeader className={styles.cardHeader}>
              <CardHeaderTitle className={clsx(result ? styles.titleSuccess : styles.titleFail)}>
                <Heading1>
                  <FontAwesomeIcon className={styles.icon} icon={result ? faCircleCheck : faCircleXmark} />
                  {result ? "Success!" : "Fail!"}
                </Heading1>
              </CardHeaderTitle>
            </CardHeader>

            {result && (
              <>
                <Paragraph className={styles.descriptionSuccess}>{t("The JWT validation was successful")}:</Paragraph>
                <TableResultsTemplate {...{ data }} />
              </>
            )}
            {!result && (
              <Paragraph className={styles.descriptionFail}>
                {t("The JWT validation failed with error message")}:
                <br />
                <Code>{data}</Code>
              </Paragraph>
            )}
          </CardWrapper>
        )}
        {!data && <Skeleton height="200px" />}
      </PageContent>
    </Page>
  );
};
