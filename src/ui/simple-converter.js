import { LitElement, html, css } from 'lit-element';

class SimpleConverter extends LitElement {
    constructor() {
        super();
    }

    static get styles() {
        return css`
            :host {
                flex-grow: 1;
                display: flex;
                flex-flow: column;
                justify-content: center;
                align-items: center;
            }

            .inputs {
                display: flex;
            }

            button {
                min-width: 320px;
                margin-top: 2em;
                border: none;
                border-radius: 5px;
                height: 36px;
                line-height: 36px;
                padding: 0 16px;
                text-transform: uppercase;
                text-decoration: none;
                color: #fff;
                background-color: var(--green);
                text-align: center;
                letter-spacing: .5px;
                -webkit-transition: background-color .2s ease-out;
                transition: background-color .2s ease-out;
                cursor: pointer;
                -webkit-box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
                box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
            }
            
            button:hover {
                background-color: #2bbbad;
                -webkit-box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.14), 0 1px 7px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -1px rgba(0, 0, 0, 0.2);
                box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.14), 0 1px 7px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -1px rgba(0, 0, 0, 0.2);
            }

            button:focus {
                outline: none;
            }

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
    }

    render() {
        return html`
            <div class="inputs">
                <div class="select">
                    <select class="select-text">
                        <option disabled selected></option>
                    </select>
                    <span class="select-highlight"></span>
					<span class="select-bar"></span>
					<label class="select-label">Convert From</label>
                </div>

                <div class="select">
                    <select class="select-text">
                        <option disabled selected></option>
                    </select>
                    <span class="select-highlight"></span>
					<span class="select-bar"></span>
					<label class="select-label">Convert To</label>
                </div>
            </div>
            <button>Convert Now</button>
        `;
    }
}

customElements.define('simple-converter', SimpleConverter);