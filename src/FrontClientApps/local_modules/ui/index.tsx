import DropdownContainer from "@skbkontur/react-ui/components/DropdownContainer/DropdownContainer";
import HideBodyVerticalScrollNormal from "@skbkontur/react-ui/components/HideBodyVerticalScroll";
import { Action as ToastAction } from "@skbkontur/react-ui/components/Toast/Toast";
import Checkbox from "@skbkontur/react-ui/Checkbox";
import Hint from "@skbkontur/react-ui/Hint";
import Input from "@skbkontur/react-ui/Input";
import Loader from "@skbkontur/react-ui/Loader";
import Logotype from "@skbkontur/react-ui/Logotype";
import MenuItem from "@skbkontur/react-ui/MenuItem";
import MenuSeparator from "@skbkontur/react-ui/MenuSeparator";
import Paging from "@skbkontur/react-ui/Paging";
import Radio from "@skbkontur/react-ui/Radio";
import RadioGroup from "@skbkontur/react-ui/RadioGroup";
import RenderContainer from "@skbkontur/react-ui/RenderContainer";
import RenderLayer from "@skbkontur/react-ui/RenderLayer";
import Select from "@skbkontur/react-ui/Select";
import SidePage from "@skbkontur/react-ui/SidePage";
import Spinner from "@skbkontur/react-ui/Spinner";
import StickyNormal from "@skbkontur/react-ui/Sticky";
import Switcher from "@skbkontur/react-ui/Switcher";
import Textarea from "@skbkontur/react-ui/Textarea";
import Toast from "@skbkontur/react-ui/Toast";
import TooltipMenu from "@skbkontur/react-ui/TooltipMenu";
import TopBar from "@skbkontur/react-ui/TopBar";

import { isTestingMode, StickyForTestingMode } from "./testing";
import { ButtonLink } from "./ButtonLink/ButtonLink";
import { DatePicker } from "./DatePicker/DatePicker";
import { LinkDropdown } from "./LinkDropdown/LinkDropdown";
import { RouterLink } from "./RouterLink/RouterLink";
import { TooltipWithOutsideClick as Tooltip } from "./TooltipWithOutsideClick/TooltipWithOutsideClick";

export {
    ButtonLink,
    RouterLink,
    Checkbox,
    DatePicker,
    DropdownContainer,
    Hint,
    Input,
    LinkDropdown,
    Loader,
    Logotype,
    MenuItem,
    MenuSeparator,
    Paging,
    Radio,
    RadioGroup,
    RenderContainer,
    RenderLayer,
    Select,
    SidePage,
    Spinner,
    Switcher,
    Textarea,
    Toast,
    ToastAction,
    Tooltip,
    TooltipMenu,
    TopBar,
};

const Sticky = isTestingMode() ? StickyForTestingMode : StickyNormal;
export { Sticky };

const HideBodyVerticalScroll = isTestingMode() ? () => null : HideBodyVerticalScrollNormal;
export { HideBodyVerticalScroll };

if (isTestingMode() && document != undefined) {
    document.body.classList.add("testing-mode");
}
