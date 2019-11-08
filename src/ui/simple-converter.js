import { LitElement, html, css } from 'lit-element';
import {MaterialSelect, MaterialText} from './material-inputs.js';

class SimpleConverter extends LitElement {
    constructor() {
        super();
    }

    static get styles() {
        return [
            css`
            :host {
                flex-grow: 2;
                display: flex;
                flex-flow: column;
                justify-content: center;
                align-items: center;
            }

            .inputs {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                align-items: center;
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
          `,
          MaterialSelect,
          MaterialText
        ];
    }

    render() {
        return html`
            <div class="inputs">
                <div class="text-field">
                    <label class="pure-material-textfield-standard">
                        <input placeholder=" ">
                        <span>Amount</span>
                    </label>
                </div>
                <div class="select">
                    <select class="select-text">
                        <option disabled selected></option>
                    </select>
                    <span class="select-highlight"></span>
					<span class="select-bar"></span>
					<label class="select-label">From</label>
                </div>

                <div class="select">
                    <select class="select-text">
                        <option disabled selected></option>
                    </select>
                    <span class="select-highlight"></span>
					<span class="select-bar"></span>
					<label class="select-label">Into</label>
                </div>
            </div>
            <button>Convert Now</button>
        `;
    }
}

customElements.define('simple-converter', SimpleConverter);