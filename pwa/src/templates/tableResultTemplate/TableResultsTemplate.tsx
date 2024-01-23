import * as React from "react";
import * as styles from "./TableResultsTemplate.module.css";
import clsx from "clsx";
import _ from "lodash";
import { Table, TableBody, TableRow, TableCell } from "@utrecht/component-library-react/dist/css-module";
import { useTranslation } from "react-i18next";
import { HorizontalOverflowWrapper } from "@conduction/components";
import { translateDate } from "../../services/dateFormat";

interface TableResultsTemplateProps {
  data: any;
}

export const TableResultsTemplate: React.FC<TableResultsTemplateProps> = ({ data }) => {
  const { t, i18n } = useTranslation();

  return (
    <HorizontalOverflowWrapper
      ariaLabels={{
        scrollLeftButton: t("Scroll table to the left"),
        scrollRightButton: t("Scroll table to the right"),
      }}
    >
      <Table className={styles.table}>
        <TableBody className={styles.tableBody}>
          {Object.keys(data).map((keyName: any, i) => (
            <>
              {keyName !== "credentialSubject" && (
                <TableRow
                  className={styles.tableRow}
                  key={i}
                  tabIndex={0}
                  aria-label={`${t(`${_.upperFirst(keyName)}`)}, ${keyName}`}
                >
                  <TableCell>{t(`${_.upperFirst(keyName)}`)}</TableCell>
                  <TableCell>{data[keyName] ?? t(`${_.upperFirst(keyName)}`)}</TableCell>
                </TableRow>
              )}
              {keyName === "credentialSubject" && (
                <>
                  {Object.keys(data.credentialSubject).map((credential, i) => (
                    <TableRow
                      className={styles.tableRow}
                      key={i}
                      tabIndex={0}
                      aria-label={`${t(`${_.upperFirst(credential)}`)}, ${
                        (credential !== "geboortedatum"
                          ? data.credentialSubject[credential]
                          : translateDate(i18n.language, data.credentialSubject[credential])) ||
                        `${t(`${_.upperFirst(credential)}`)} ${t("Unknown")}`
                      }`}
                    >
                      <TableCell>{t(`${_.upperFirst(credential)}`)}</TableCell>
                      <TableCell>
                        {(credential !== "geboortedatum"
                          ? data.credentialSubject[credential]
                          : translateDate(i18n.language, data.credentialSubject[credential])) ||
                          `${t(`${_.upperFirst(credential)}`)} ${t("Unknown")}`}
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )}
            </>
          ))}
        </TableBody>
      </Table>
    </HorizontalOverflowWrapper>
  );
};
