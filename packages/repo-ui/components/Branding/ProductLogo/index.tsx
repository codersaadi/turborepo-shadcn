import { type HtmlHTMLAttributes, memo } from "react";
import CustomLogo from "./Custom";

interface AcmeProps extends HtmlHTMLAttributes<HTMLDivElement> {

}
export const ProductLogo = memo<AcmeProps>((props) => {
    return <CustomLogo {...props} />;
});
