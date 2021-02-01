//完整组件列表地址 https://github.com/ElemeFE/element/blob/master/components.json
/* element组件 */
import Vue from 'vue';
import {
    Button, Loading, Container, Header, Aside, Footer, Menu,
    Submenu, MenuItem, MenuItemGroup, Table, TableColumn, main,
    Row, Col, Pagination,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Message,
    Form,
    FormItem,
    Input,
    Dialog,
    Select,
    Option,
    OptionGroup,
    Image,
    Breadcrumb,
    BreadcrumbItem,
    Scrollbar,
} from 'element-ui';

// :modal-append-to-body="false"
// :append-to-body="true"
// :close-on-click-modal="false"
// :close-on-press-escape="false"
Dialog.props.modalAppendToBody.default = false;
Dialog.props.appendToBody.default = true;
Dialog.props.closeOnClickModal.default = false;
Dialog.props.closeOnPressEscape.default = false;
Vue.use(Button)
Vue.use(Loading)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Footer)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Table)
Vue.use(TableColumn)
// Vue.use(main)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Row)
Vue.use(Col)
Vue.use(Pagination)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Dialog)
Vue.use(Select)
Vue.use(Option)
Vue.use(OptionGroup)
Vue.use(Image)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Scrollbar)

Vue.prototype.$Message = Message;