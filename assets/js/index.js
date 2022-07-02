const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const newTaskAddInput = $('.new-task-add__input')
const newTaskAddBtn = $('.new-task-add__btn')
const listTask = $('.list-task__wrapper')

const localStorageKey = 'TodoList'

const app = {
	tasks: JSON.parse(localStorage.getItem(localStorageKey)) || [],

	taskElement: function (content, id) {
		return `<li data-index="${id}" class="list-task__item">
              <input type="text" class="list-task__item--input" value="${content}" readonly />
              <div>
                <button class="list-task__item-action list-task__item-action--edit">Chỉnh sửa</button>
                <button class="list-task__item-action list-task__item-action--del">Xóa</button>
              </div>
            </li>`
	},

	saveLocalStorage: function () {
		localStorage.setItem(localStorageKey, JSON.stringify(this.tasks))
	},

	handleEvents: function () {
		const _this = this

		// Xử lý thêm task
		newTaskAddBtn.onclick = function () {
			if (newTaskAddInput.value) {
				const taskItemEmpty = $('.list-task__item--empty')
				if (taskItemEmpty) {
					taskItemEmpty.remove()
				}

				const id = listTask.lastElementChild
					? parseInt(listTask.lastElementChild.dataset.index) + 1
					: 0

				_this.tasks.push({ id, content: newTaskAddInput.value })
				_this.saveLocalStorage()
				listTask.insertAdjacentHTML(
					'beforeend',
					_this.taskElement(newTaskAddInput.value, id),
				)

				newTaskAddInput.value = ''
			}
		}

		// xử lý sửa / xóa task
		listTask.onclick = function (e) {
			const btn = e.target
			if (btn.classList.contains('list-task__item-action')) {
				const taskItem = btn.parentElement.parentElement
				const taskItemInput = taskItem.firstElementChild

				// sửa task
				if (btn.textContent.toLowerCase() !== 'xóa') {
					if (btn.textContent === 'Chỉnh sửa') {
						taskItemInput.removeAttribute('readonly')
						taskItemInput.focus()
						btn.textContent = 'Lưu lại'
					} else {
						const id = parseInt(taskItem.dataset.index)
						const index = _this.tasks.findIndex(
							(taskItem) => taskItem.id === id,
						)
						_this.tasks.splice(index, 1, {
							id,
							content: taskItemInput.value,
						})
						_this.saveLocalStorage()
						taskItemInput.setAttribute('readonly', '')
						btn.textContent = 'Chỉnh sửa'
					}
				} else {
					// xóa task
					const id = parseInt(taskItem.dataset.index)
					const index = _this.tasks.findIndex((taskItem) => taskItem.id === id)
					_this.tasks.splice(index, 1)
					taskItem.remove()
					_this.saveLocalStorage()

					if (_this.tasks.length === 0) {
						listTask.innerHTML = `<li class="list-task__item--empty">Danh sách rỗng</li>`
					}
				}
			}
		}
	},

	render: function () {
		let htmls
		if (this.tasks.length === 0) {
			htmls = `<li class="list-task__item--empty">Danh sách rỗng</li>`
		} else {
			htmls = this.tasks
				.map((task) => {
					return this.taskElement(task.content, task.id)
				})
				.join('')
		}

		listTask.innerHTML = htmls
	},

	start: function () {
		// Render task list
		this.render()

		// Lắng nghe / xử lý các sự kiện (DOM Events)
		this.handleEvents()
	},
}

app.start()
