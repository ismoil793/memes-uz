import { Notyf, INotyfIcon } from 'notyf';
import 'notyf/notyf.min.css';

const icon: INotyfIcon = {
  className: 'notify-icon-img',
  tagName: 'div',
  text: '',
  color: '#fff'
};

export function notifySuccess(msg: any, duration = 4000) {
  const notyf = new Notyf({
    types: [
      {
        type: 'success',
        backgroundColor: '#6441a5',
        icon
      }
    ],
    duration,
    position: { x: 'right', y: window.innerWidth <= 768 ? 'bottom' : 'bottom' },
    dismissible: true
  });

  notyf.open({
    type: 'success',
    message: msg
  });
}
