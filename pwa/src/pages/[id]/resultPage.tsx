import * as React from "react";
import _ from "lodash";
import { PageProps } from "gatsby";
import { ResultTemplate } from "../../templates/resultTemplate/ResultTemplate";

const ResultPage: React.FC<PageProps> = (props: PageProps) => {
  return <ResultTemplate id={props.params.id} />;
};
export default ResultPage;
