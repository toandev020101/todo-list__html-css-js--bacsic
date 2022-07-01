const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const newTaskAddInput = $('.new-task-add__input')
const newTaskAddBtn = $('.new-task-add__btn')
const listTask = $('.list-task__wrapper')

const app = {
	tasks: ['Hello World', 'Todo List', 'Build Task'],

	taskElement: function (item) {
		return `<li class="list-task__item">
              <input type="text" class="list-task__item--input" value="${item}" readonly />
              <div>
                <button class="list-task__item-action list-task__item-action--edit">Chỉnh sửa</button>
                <button class="list-task__item-action list-task__item-action--del">Xóa</button>
              </div>
            </li>`
	},

	handleEvents: function () {
		const _this = this
		let listTaskItemEdit = $$('.list-task__item-action--edit')
		let listTaskItemDel = $$('.list-task__item-action--del')

		// Xử lý thêm task
		newTaskAddBtn.onclick = function () {
			if (newTaskAddInput.value) {
				const taskItemEmpty = $('.list-task__item--empty')
				if (taskItemEmpty) {
					taskItemEmpty.remove()
				}
				_this.tasks.push(newTaskAddInput.value)

				listTask.insertAdjacentHTML(
					'beforeend',
					_this.taskElement(newTaskAddInput.value),
				)

				newTaskAddInput.value = ''
				_this.handleEvents()
			}
		}

		// Xử lý sửa task
		listTaskItemEdit.forEach((taskItemEdit, index) => {
			taskItemEdit.onclick = function () {
				const taskItemAction = taskItemEdit.parentElement
				const taskItem = taskItemAction.parentElement

				const taskItemInput = taskItem.firstElementChild
				if (taskItemEdit.textContent === 'Chỉnh sửa') {
					taskItemInput.removeAttribute('readonly')
					taskItemInput.focus()
					taskItemEdit.textContent = 'Lưu lại'
				} else {
					_this.tasks.splice(index, 1, taskItemInput.value)
					taskItemInput.setAttribute('readonly', '')
					taskItemEdit.textContent = 'Chỉnh sửa'
				}
			}
		})

		// Xử lý xóa task
		listTaskItemDel.forEach((taskItemDel, index) => {
			taskItemDel.onclick = function () {
				const taskItemAction = taskItemDel.parentElement
				const taskItem = taskItemAction.parentElement

				_this.tasks.splice(index, 1)
				taskItem.remove()

				if (_this.tasks.length === 0) {
					listTask.innerHTML = `<li class="list-task__item--empty">Danh sách rỗng</li>`
				}

				_this.handleEvents()
			}
		})
	},

	render: function () {
		let htmls

		if (this.tasks.length === 0) {
			htmls = [`<li class="list-task__item--empty">Danh sách rỗng</li>`]
		} else {
			htmls = this.tasks.map((task) => {
				return this.taskElement(task)
			})
		}

		listTask.innerHTML = htmls.join('')
	},

	start: function () {
		// Render task list
		this.render()

		// Lắng nghe / xử lý các sự kiện (DOM Events)
		this.handleEvents()
	},
}

app.start()
