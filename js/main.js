const submitButton = document.getElementById(`submitButton`);
const addBookButton = document.getElementById(`addBookButton`);
const exitForm = document.getElementById(`closeForm`);
const formContainer = document.getElementById(`formContainer`);
const bookTable = document.getElementById(`bookTable`);
const table = document.querySelector(`table`);
let myLibrary = [{
    title: `The Hobbit`,
    author: `J.R.R. Tolkien`,
    coverType: `Paperback`,
    checkedOut: false,
    comments: `Rare cover art - Do not lend out.`,
}];

function Book(title, author, coverType, checkedOut, comments) {
    this.title = title
    this.author = author
    this.coverType = coverType
    this.checkedOut = checkedOut
    this.comments = comments
}

createCard();
submitButton.addEventListener(`click`, operate);
addBookButton.addEventListener(`click`, showBlankForm);
exitForm.addEventListener(`click`, closeForm);
table.addEventListener(`click`, tableClick);

function operate(event) {
    event.preventDefault();
    addBookToLibrary();
    closeForm();
    createCard();
}

function addBookToLibrary() {
    const newBook = createBook();
    myLibrary.push(newBook);
}

function createBook() {
    const title = addBookForm.elements[`bookTitle`].value;
    const author = addBookForm.elements[`bookAuthor`].value;
    const coverType = addBookForm.elements[`coverType`].value;
    const checkedOut = addBookForm.elements[`checkedOutSwitch`].checked;
    const comments = addBookForm.elements[`optionalComments`].value;
    return new Book(title, author, coverType, checkedOut, comments);
}

function createCard() {
    if (!myLibrary.length) return;

    const currentBook = myLibrary.at(-1);
    currentBook.bookID = myLibrary.indexOf(currentBook);
    console.table(currentBook);

    const bookCard = document.createElement(`tr`);
    const bookTitle = document.createElement(`td`);
    const bookAuthor = document.createElement(`td`);
    const coverType = document.createElement(`td`);
    const checkedOut = document.createElement(`td`);
    const iconsCell = document.createElement(`td`);
    const editIcon = document.createElement(`span`);
    const removeIcon = document.createElement(`span`);

    bookTitle.innerText = currentBook.title;
    bookAuthor.innerText = currentBook.author;
    coverType.innerText = currentBook.coverType;
    checkedOut.innerText = currentBook.checkedOut ? `Checked Out` : `In Stock`;
    editIcon.innerText = `edit`;
    removeIcon.innerText = `close`;

    iconsCell.classList.add(`icons-cell`);
    editIcon.classList.add(`material-icons-outlined`, `edit`);
    removeIcon.classList.add(`material-icons-outlined`, `remove`);

    removeIcon.dataset.indexNumber = currentBook.bookID;
    editIcon.dataset.indexNumber = currentBook.bookID;
    checkedOut.dataset.indexNumber = currentBook.bookID;

    bookTable.appendChild(bookCard);
    bookCard.appendChild(bookTitle);
    bookCard.appendChild(bookAuthor);
    bookCard.appendChild(coverType);
    bookCard.appendChild(checkedOut);
    bookCard.appendChild(iconsCell);
    iconsCell.appendChild(editIcon);
    iconsCell.appendChild(removeIcon);
}

function tableClick(event) {
    if (event.target.innerText === `close`) removeBook(event);
    else if (event.target.innerText === `edit`) editBook(event);
    else if (event.target.innerText === `In Stock`) changeStatus(event);
    else if (event.target.innerText === `Checked Out`) changeStatus(event);
}

function removeBook(event) {
    const index = parseInt(event.target.dataset.indexNumber);
    myLibrary = myLibrary.filter((book) => book.bookID !== index);
    removeCard(event);
}

function removeCard(event) {
    event.target.parentNode.parentNode.remove();
};

function editBook(event) {
    //Still need to come back and figure this out!
    const index = parseInt(event.target.dataset.indexNumber);
    showEditForm(index);
}

function showEditForm(index) {
    //Still need to come back and figure this out!
    document.getElementById(`bookTitle`).value = myLibrary[index].title;
    document.getElementById(`bookAuthor`).value = myLibrary[index].author;
    document.getElementById(`coverType`).value = myLibrary[index].coverType;
    document.getElementById(`optionalComments`).value = myLibrary[index].comments;
    document.getElementById(`checkedOutSwitch`).checked = myLibrary[index].checkedOut;
    formContainer.classList.add(`show`);
}

function changeStatus(event) {
    const index = parseInt(event.target.dataset.indexNumber);
    console.log(index);
    if (event.target.innerText === `In Stock`) {
        event.target.innerText = `Checked Out`;
        myLibrary[index].checkedOut = true;
    } else {
        event.target.innerText = `In Stock`;
        myLibrary[index].checkedOut = false;
    }
}

function showBlankForm() {
    document.getElementById(`bookTitle`).value = ``;
    document.getElementById(`bookAuthor`).value = ``;
    document.getElementById(`coverType`).value = `Paperback`;
    document.getElementById(`optionalComments`).value = ``;
    document.getElementById(`checkedOutSwitch`).checked = false;
    formContainer.classList.add(`show`);
}

function closeForm() {
    formContainer.classList.remove(`show`);
}