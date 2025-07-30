export enum ButtonStyle {
    JAVA = 'java',
    MIN = 'minimal',
    PORT = 'port',
    BUBBLE = 'bubble',
    TEXT = 'text',
    ZARA = 'zara'
}

export enum InputStyle {
    MIN = 'minimal',
    BUBBLE = 'bubble',
    ERROR = 'error',
    SEARCH = 'search'
}

export enum ConStyle {
    STICKY = 'sticky',
    FIXED = 'fixed',
    TOP = 'top',
    GHOST = 'ghost',
    LAKE = 'dam',
    BLUR = 'blur',
    RELATIVE = 'relative',
    FRONT = 'front'
}

export enum CardStyle {
    GHOST = 'ghost',
    ZARA = 'zara'
}

export enum PriceStyle {
    JAVA = 'java',
    MIN = 'minimal',
    PORT = 'port',
    ZARA = 'zara'
}

export enum ImageStyle{
    BASIC = 'default',
    PICK = 'pick',
    PICKED = 'picked',
    PRODUCT = 'product'
}

export enum Size {
    SMALL = 's',
    MEDIUM = 'm',
    LARGE = 'l',
    MAX = 'max',
    FULLSCREEN = 'fs',
    SIX = 'six',
    THREE = 'three',
    FOUR = 'four',
    ONE = 'one',
    NONE = 'none',
    SEVEN = 'se7en',
    EIGHT = 'e8ght',
    TWO = 'two'
}

export type ExcludeFullscreen<T> = T extends Size.FULLSCREEN ? never : T;

export enum CardType {
    SHOP = 'shop-card',
    CHECK = 'shop-check',
    ZARA = 'zara-show'
}

export enum ConType {
    NAV = 'nav-bar',
    SIDE = 'side-bar',
    CCF = 'ccf',
    CHECKOUT = 'checkout-bar',
    FC = 'flex-center',
    RELATIVE = 'relative-bar',
    LOGIN = 'login',
    SIGNUP = 'signup',
    LIST = 'list',
    FLEXLIST = 'flex-list'
}

export enum ButtonType {
    CLICK = 'click',
    TOGGLE = 'toggle',
    SWITCH = 'switch',
    PLUS = 'plus',
    MINUS = 'minus'
}

export enum InputType {
    TEXT = 'text',
    EMAIL = 'email',
    PASSWORD = 'password',
    READONLY = 'readonly',
    NUMBER = 'number',
    TEL = 'tel'
}

export enum PriceType {
    EVRO = '€',
    DOLLAR = '$',
    DINAR = 'RSD'
}

export enum ImageType{
    IMG = 'image',
    BTN = 'button'
}