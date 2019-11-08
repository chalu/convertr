import { css } from 'lit-element';

export const MaterialSelect = css`
    .select {
        font-family:
        'Roboto','Helvetica','Arial',sans-serif;
        position: relative;
        width: 320px;
        margin: 1.5em;
    }

    .select-text {
        position: relative;
        font-family: inherit;
        background-color: transparent;
        width: 320px;
        padding: 10px 10px 10px 0;
        font-size: 18px;
        border-radius: 0;
        border: none;
        border-bottom: 1px solid rgba(0,0,0, 0.12);
    }

    /* Remove focus */
    .select-text:focus {
        outline: none;
        border-bottom: 1px solid rgba(0,0,0, 0);
    }

    /* Use custom arrow */
    .select .select-text {
        appearance: none;
        -webkit-appearance:none
    }

    .select:after {
        position: absolute;
        top: 18px;
        right: 10px;
        /* Styling the down arrow */
        width: 0;
        height: 0;
        padding: 0;
        content: '';
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid rgba(0, 0, 0, 0.12);
        pointer-events: none;
    }


    /* LABEL ======================================= */
    .select-label {
        color: rgba(0,0,0, 0.26);
        font-size: 18px;
        font-weight: normal;
        position: absolute;
        pointer-events: none;
        left: 0;
        top: 10px;
        transition: 0.2s ease all;
    }

    /* active state */
    .select-text:focus ~ .select-label, .select-text:valid ~ .select-label {
        color: #2F80ED;
        top: -20px;
        transition: 0.2s ease all;
        font-size: 14px;
    }

    /* BOTTOM BARS ================================= */
    .select-bar {
        position: relative;
        display: block;
        width: 320px;
    }

    .select-bar:before, .select-bar:after {
        content: '';
        height: 2px;
        width: 0;
        bottom: 1px;
        position: absolute;
        background: #2F80ED;
        transition: 0.2s ease all;
    }

    .select-bar:before {
        left: 50%;
    }

    .select-bar:after {
        right: 50%;
    }

    /* active state */
    .select-text:focus ~ .select-bar:before, .select-text:focus ~ .select-bar:after {
        width: 50%;
    }

    /* HIGHLIGHTER ================================== */
    .select-highlight {
        position: absolute;
        height: 60%;
        width: 100px;
        top: 25%;
        left: 0;
        pointer-events: none;
        opacity: 0.5;
    }
`;

export const MaterialText = css`
    .pure-material-textfield-standard {
        position: relative;
        display: inline-block;
        font-family: var(--pure-material-font, "Roboto", "Segoe UI", BlinkMacSystemFont, system-ui, -apple-system);
        font-size: 16px;
        line-height: 1.5;
        overflow: hidden;
    }

    /* Input, Textarea */
    .pure-material-textfield-standard > input,
    .pure-material-textfield-standard > textarea {
        display: block;
        box-sizing: border-box;
        margin: 0;
        border: none;
        border-top: solid 27px transparent;
        border-bottom: solid 1px rgba(var(--pure-material-onsurface-rgb, 0, 0, 0), 0.6);
        padding: 0 0 4px;
        width: 100%;
        height: inherit;
        color: rgba(var(--pure-material-onsurface-rgb, 0, 0, 0), 0.87);
        background-color: transparent;
        box-shadow: none; /* Firefox */
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
        caret-color: rgb(var(--pure-material-primary-rgb, 33, 150, 243));
        transition: border-bottom 0.2s, background-color 0.2s;
    }

    /* Span */
    .pure-material-textfield-standard > input + span,
    .pure-material-textfield-standard > textarea + span {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: block;
        box-sizing: border-box;
        padding: 7px 0 0;
        color: rgba(var(--pure-material-onsurface-rgb, 0, 0, 0), 0.6);
        font-size: 75%;
        line-height: 18px;
        pointer-events: none;
        transition: color 0.2s, font-size 0.2s, line-height 0.2s;
    }

    /* Underline */
    .pure-material-textfield-standard > input + span::after,
    .pure-material-textfield-standard > textarea + span::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        display: block;
        width: 100%;
        height: 2px;
        background-color: rgb(var(--pure-material-primary-rgb, 33, 150, 243));
        transform-origin: bottom center;
        transform: scaleX(0);
        transition: transform 0.2s;
    }

    /* Hover */
    .pure-material-textfield-standard > input:hover,
    .pure-material-textfield-standard > textarea:hover {
        border-bottom-color: rgba(var(--pure-material-onsurface-rgb, 0, 0, 0), 0.87);
    }

    /* Placeholder-shown */
    .pure-material-textfield-standard > input:not(:focus):placeholder-shown + span,
    .pure-material-textfield-standard > textarea:not(:focus):placeholder-shown + span {
        font-size: inherit;
        line-height: 56px;
    }

    /* Focus */
    .pure-material-textfield-standard > input:focus,
    .pure-material-textfield-standard > textarea:focus {
        outline: none;
    }

    .pure-material-textfield-standard > input:focus + span,
    .pure-material-textfield-standard > textarea:focus + span {
        color: rgb(var(--pure-material-primary-rgb, 33, 150, 243));
    }

    .pure-material-textfield-standard > input:focus + span::before,
    .pure-material-textfield-standard > textarea:focus + span::before {
        opacity: 0.12;
    }

    .pure-material-textfield-standard > input:focus + span::after,
    .pure-material-textfield-standard > textarea:focus + span::after {
        transform: scale(1);
    }

    /* Disabled */
    .pure-material-textfield-standard > input:disabled,
    .pure-material-textfield-standard > textarea:disabled {
        border-bottom-color: rgba(var(--pure-material-onsurface-rgb, 0, 0, 0), 0.38);
        color: rgba(var(--pure-material-onsurface-rgb, 0, 0, 0), 0.38);
    }

    .pure-material-textfield-standard > input:disabled + span,
    .pure-material-textfield-standard > textarea:disabled + span {
        color: rgba(var(--pure-material-onsurface-rgb, 0, 0, 0), 0.38);
    }

    /* Faster transition in Safari for less noticable fractional font-size issue */
    @media not all and (min-resolution:.001dpcm) {
        @supports (-webkit-appearance:none) {
            .pure-material-textfield-standard > input,
            .pure-material-textfield-standard > input + span,
            .pure-material-textfield-standard > input + span::after,
            .pure-material-textfield-standard > textarea,
            .pure-material-textfield-standard > textarea + span,
            .pure-material-textfield-standard > textarea + span::after {
                transition-duration: 0.1s;
            }
        }
    }
`;