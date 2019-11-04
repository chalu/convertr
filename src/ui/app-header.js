import { LitElement, html, css } from 'lit-element';
import { notifyr as notify } from '../js/utils.js';

class AppHeader extends LitElement {

    constructor() {
        super();
    }

    render() {
        return html`
            <header>
                <h2 class="title">Convertr</h2>
                <div class="tbar">
                    <button id="offline">
                        <i class="material-icons">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="red">
                            <path fill="none" d="M24 .01c0-.01 0-.01 0 0L0 0v24h24V.01zM0 0h24v24H0V0zm0 0h24v24H0V0z" />
                            <path
                            d="M22.99 9C19.15 5.16 13.8 3.76 8.84 4.78l2.52 2.52c3.47-.17 6.99 1.05 9.63 3.7l2-2zm-4 4c-1.29-1.29-2.84-2.13-4.49-2.56l3.53 3.53.96-.97zM2 3.05L5.07 6.1C3.6 6.82 2.22 7.78 1 9l1.99 2c1.24-1.24 2.67-2.16 4.2-2.77l2.24 2.24C7.81 10.89 6.27 11.73 5 13v.01L6.99 15c1.36-1.36 3.14-2.04 4.92-2.06L18.98 20l1.27-1.26L3.29 1.79 2 3.05zM9 17l3 3 3-3c-1.65-1.66-4.34-1.66-6 0z" />
                        </svg>
                        </i>
                    </button>
                    <!-- TODO: add a btn to switch between INPUT & SELECT -->
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
            this.networkChanged({type: 'offline'});
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('online', this.networkChanged);
        window.removeEventListener('offline', this.networkChanged);
    }

    networkChanged({ type }) {
        const docBody = document.querySelector('body');
        if (type === 'offline') {
            docBody.classList.add('offline');
            notify('you no longer have connection!');
        } else {
            docBody.classList.remove('offline');
            notify('your connetion has been restored!');
        }
    }

}

customElements.define('app-header', AppHeader);