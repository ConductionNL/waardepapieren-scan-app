import * as React from "react";
import * as styles from "./ResultTemplate.module.css";
import * as jose from "jose";
import clsx from "clsx";
import { Page, PageContent } from "@utrecht/component-library-react/dist/css-module";
import { Code, CodeBlock, Heading1, Heading3, Paragraph } from "@utrecht/component-library-react";
import { CardHeader, CardHeaderTitle, CardWrapper, HorizontalOverflowWrapper } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { TableResultsTemplate } from "../tableResultTemplate/TableResultsTemplate";

interface ResultTemplateProps {
  id: string;
}

export const ResultTemplate: React.FC<ResultTemplateProps> = ({ id }) => {
  const { t } = useTranslation();
  const [token, setToken] = React.useState<any>("");
  const [data, setData] = React.useState<any>("");
  const [result, setResult] = React.useState<boolean>(false);

  const alg = "RS512";
  const x509 = `-----BEGIN CERTIFICATE-----
  Lorem ipsum dolor sit amet consectetur adipisicing elit. 
  Officiis optio corporis dolorem quae molestias! At pariatur quaerat natus quod voluptatum dignissimos. 
  Deserunt officia dolorum, aspernatur magnam consequatur ullam labore fugiat.
  -----END CERTIFICATE-----`; //Set publickey/certificate

  React.useEffect(() => {
    async function getToken() {
      const publicKey = await jose.importX509(x509, alg);

      setToken(publicKey);
    }
    if (!token) {
      getToken();
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
      </PageContent>
    </Page>
  );
};
