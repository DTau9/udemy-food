import { openModal, closeModal } from './modal';
import { postData } from '../services/servicces';

function forms(formSelector, modalTimerId) {
	//======================== Forms =================================

	const forms = document.querySelectorAll(formSelector);
	// объект уведомлений о статусе отправки формы
	const message = {
		loading: 'img/form/spinner.svg',
		success: 'Спасибо! скоро Мы с вами свяжемся',
		failure: 'Что-то пошло не так'
	};

	// навешиваем функцию-обработчик на каждую форму
	forms.forEach(item => {
		bindPostData(item);
	});

	// функция отправки данных
	function bindPostData(form) {
		form.addEventListener('submit', (e) => {
			e.preventDefault();

			// сформировать уведомление о статусе отправки формы
			const statusMessage = document.createElement('img');
			// показать при начале отправки
			statusMessage.src = message.loading;
			statusMessage.style.cssText = `
				display: block;
				margin: 0 auto;
			`;
			form.insertAdjacentElement('afterend', statusMessage);

			const formData = new FormData(form);

			const json = JSON.stringify(Object.fromEntries(formData.entries()));

			postData(' http://localhost:3000/requests', json)
				.then(data => {
					console.log(data);
					// показать при успешном запросе
					showThanksModal(message.success);
					statusMessage.remove();
				})
				.catch(() => showThanksModal(message.failure))
				.finally(() => {
					//очистить поле после ввода
					form.reset();
				});
		});
	}

	function showThanksModal(message) {
		const prevModalDiallog = document.querySelector('.modal__dialog');

		prevModalDiallog.classList.add('hide');
		openModal('.modal', modalTimerId);

		const thanksModal = document.createElement('div');
		thanksModal.classList.add('modal__dialog');
		thanksModal.innerHTML = `
			<div class="modal__content">
				<div class="modal__close" data-close>×</div>
				<div class="modal__title">${message}</div>
			</div>
		`;

		document.querySelector('.modal').append(thanksModal);

		// закрыть модальное окно после благодарности
		setTimeout(() => {
			thanksModal.remove();
			prevModalDiallog.classList.add('show');
			prevModalDiallog.classList.remove('hide');
			closeModal('.modal');
		}, 4000);
	}
}

export default forms;