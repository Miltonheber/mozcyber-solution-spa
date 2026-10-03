import "material-symbols/rounded.css";

// Google Material Symbols (rounded). Peso global em --icon-weight (globals.css).
// `size` é em px; o eixo óptico acompanha o tamanho para manter o traço consistente.
const OPTICAL_MIN = 20;
const OPTICAL_MAX = 48;

export function Icon({ name, size = 20, fill = false, className = "", style, ...rest }) {
  const opsz = Math.min(OPTICAL_MAX, Math.max(OPTICAL_MIN, size));
  return (
    <span
      aria-hidden="true"
      className={`material-symbols-rounded inline-flex shrink-0 select-none items-center justify-center leading-none ${className}`}
      style={{
        fontSize: size,
        width: size,
        height: size,
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' var(--icon-weight, 400), 'opsz' ${opsz}`,
        ...style,
      }}
      {...rest}
    >
      {name}
    </span>
  );
}

function makeIcon(name, defaults = {}) {
  const Component = (props) => <Icon name={name} {...defaults} {...props} />;
  Component.displayName = `Icon(${name})`;
  return Component;
}

export const ArrowBack = makeIcon("arrow_back");
export const ArrowForward = makeIcon("arrow_forward");
export const ArrowOutward = makeIcon("arrow_outward");
export const Block = makeIcon("block");
export const Call = makeIcon("call");
export const CheckCircle = makeIcon("check_circle", { fill: true });
export const Close = makeIcon("close");
export const DarkMode = makeIcon("dark_mode");
export const ErrorCircle = makeIcon("error", { fill: true });
export const ExpandMore = makeIcon("expand_more");
export const Flag = makeIcon("flag");
export const Help = makeIcon("help", { fill: true });
export const Info = makeIcon("info", { fill: true });
export const LightMode = makeIcon("light_mode");
export const Key = makeIcon("key");
export const Menu = makeIcon("menu");
export const MenuBook = makeIcon("menu_book");
export const Progress = makeIcon("progress_activity");
export const Psychology = makeIcon("psychology");
export const SettingsBrightness = makeIcon("brightness_auto");
export const Search = makeIcon("search");
export const Shield = makeIcon("shield");
export const SimCard = makeIcon("sim_card");
export const Sms = makeIcon("sms");
export const Warning = makeIcon("warning", { fill: true });
