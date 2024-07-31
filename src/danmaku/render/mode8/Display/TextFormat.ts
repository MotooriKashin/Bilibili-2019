export class TextFormat {
    margin = '';

    constructor(
        public font = "SimHei",
        public size = 25,
        public color = 0xFFFFFF,
        public bold = false,
        public italic = false,
        public underline = false,
        public url = '',
        public target = '',
        public align = 'left',
        public leftMargin = 0,
        public rightMargin = 0,
        public indent = 0,
        public leading = 0,
    ) { }
}