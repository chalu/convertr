import { LitElement, html, css } from 'lit-element';

class QueryConverter extends LitElement {

    static get styles(){
        return css`
            :host {
                flex-grow: 2;
                display: flex;
                flex-flow: column;
                justify-content: center;
                align-items: center;
            }

            .inputs {
                min-width: 80%;
            }

            [data-omnibox-wrap] {
                width: 100%;
                overflow: hidden;
                margin-bottom: 1em;
            }

            [data-omnibox-wrap] input {
                width: 100%;
                border: 0;
                padding: 10px 5px;
                font-size: xx-large;
                color: var(--green);
                text-align: center;
                background: transparent;
                text-transform: uppercase;
                border-bottom: 2px solid var(--green);
              }

              [data-omnibox-wrap] input:focus {
                  outline: none;
              }
            
              [data-omnibox-wrap] input::placeholder,
              [data-omnibox-wrap] input:placeholder-shown {
                text-transform: uppercase;
                color: #ccc;
                font-style: italic;
                text-align: center;
              }
            
              [data-omnibox-wrap] input.invalid {
                border-bottom: 2px dotted red;
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
        `;
    }

    render(){
        return html`
            <div class="inputs">
                <div data-omnibox-wrap>
                    <input type="text" id="omnibox" placeholder="USD > ZAR, NGN" />
                    <label for="omnibox"></label>
                </div>
            </div>
            <button>Convert Now</button>
        `;
    }

}

customElements.define('query-converter', QueryConverter);