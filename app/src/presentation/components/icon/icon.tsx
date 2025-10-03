import cn from "@presentation/utils/cn";
import type { IconBaseProps, IconType } from "react-icons/lib";

export type IconProps = IconBaseProps & {
  Icon: IconType;
};

export const Icon = ({ Icon, className, ...props }: IconProps) => {
  return <Icon className={cn("text-xl", className)} {...props} />;
};
