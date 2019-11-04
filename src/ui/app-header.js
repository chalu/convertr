import { LitElement, html, css } from 'lit-element';
import { connect } from 'pwa-helpers';

import { store } from '../state/store.js';
import { notifyr as notify } from '../js/utils.js';
import { connectionChanged } from '../state/actions.js';

class AppHeader extends connect(store)(LitElement) {

    constructor() {
        super();
        this.networkChanged = this.networkChanged.bind(this);
    }

    stateChanged(state) {
        const { connection, showConnectionNotification } = state;
        this.offline = connection === 'offline' ? true : false;

        if (connection === 'offline' && showConnectionNotification) {
            notify('you no longer have connection!');
        } else if (connection === 'online' && showConnectionNotification) {
            notify('your connection is restored!');
        }
    }

    static get styles() {
        return css`
            header {
                display: flex;
                justify-content: space-between;
            }

            header .title {
                margin-left: 32px;
                color: var(--black);
                font-size: 2rem;
                line-height: 110%;
                font-weight: 400;
            }

            header .tbar {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                margin-right: 32px;
            }

            header button {
                border: none;
                background: var(--white);
                border-radius: 50%;
                width: 48px;
                height: 48px;
                cursor: pointer;
                outline: none;
            }

            header button:hover {
                border: 1px solid var(--black);
                background: var(--white);
            }

            header button:focus {
                outline: none;
            }

            header [data-btn-offline] {
                margin-right: 36px;
                pointer-events: none;
                opacity: 0;
                transition: opacity 1.5s ease-in;
                transition: border 2s ease-in;
            }

            [offline] .tbar [data-btn-offline] {
                opacity: 1;
                pointer-events: auto;
            }
        `;
    }

    static get properties() {
        return {
            offline: {type: Boolean, reflect: true}
        };
    }

    render() {
        return html`
            <header ?offline="${this.offline}">
                <h2 class="title">Convertr</h2>
                <div class="tbar">
                    <button data-btn-offline>
                        <i class="material-icons">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="red">
                                <path fill="none" d="M24 .01c0-.01 0-.01 0 0L0 0v24h24V.01zM0 0h24v24H0V0zm0 0h24v24H0V0z" />
                                <path
                                d="M22.99 9C19.15 5.16 13.8 3.76 8.84 4.78l2.52 2.52c3.47-.17 6.99 1.05 9.63 3.7l2-2zm-4 4c-1.29-1.29-2.84-2.13-4.49-2.56l3.53 3.53.96-.97zM2 3.05L5.07 6.1C3.6 6.82 2.22 7.78 1 9l1.99 2c1.24-1.24 2.67-2.16 4.2-2.77l2.24 2.24C7.81 10.89 6.27 11.73 5 13v.01L6.99 15c1.36-1.36 3.14-2.04 4.92-2.06L18.98 20l1.27-1.26L3.29 1.79 2 3.05zM9 17l3 3 3-3c-1.65-1.66-4.34-1.66-6 0z" />
                            </svg>
                        </i>
                    </button>
                    <button>
                        <i class="material-icons">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M7.77 6.76L6.23 5.48.82 12l5.41 6.52 1.54-1.28L3.42 12l4.35-5.24zM7 13h2v-2H7v2zm10-2h-2v2h2v-2zm-6 2h2v-2h-2v2zm6.77-7.52l-1.54 1.28L20.58 12l-4.35 5.24 1.54 1.28L23.18 12l-5.41-6.52z"/></svg>
                        </i>
                    </button>
                </div>
            </header>
        `;
    }

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('online', this.networkChanged);
        window.addEventListener('offline', this.networkChanged);

        if (window && 'Notification' in window && Notification.permission !== 'denied') {
            Notification.requestPermission(status => {
                if (status === 'granted') {

                }
            });
        }

        if (navigator.onLine !== undefined && navigator.onLine === false) {
            this.networkChanged({type: 'offline'}, false);
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('online', this.networkChanged);
        window.removeEventListener('offline', this.networkChanged);
    }

    networkChanged({ type: status }, showNotification = true) {
        store.dispatch(connectionChanged(status, showNotification));
    }

}

customElements.define('app-header', AppHeader);