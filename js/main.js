const submitButton = document.getElementById(`submitButton`);
const addBookButton = document.getElementById(`addBookButton`);
const exitForm = document.getElementById(`closeForm`);
const formContainer = document.getElementById(`formContainer`);
const bookTable = document.getElementById(`bookTable`);
let myLibrary = [{
    title: `The Hobbit`,
    author: `J.R.R. Tolkien`,
    coverType: `Paperback`,
    checkedOut: false,
    comments: `Rare cover art - Do not lend out.`
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
addBookButton.addEventListener(`click`, showForm);
exitForm.addEventListener(`click`, hideForm);


function operate(event) {
    event.preventDefault();
    addBookToLibrary();
    hideForm();
    createCard();

}

function addBookToLibrary(event) {
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

    bookTable.appendChild(bookCard);
    bookCard.appendChild(bookTitle);
    bookCard.appendChild(bookAuthor);
    bookCard.appendChild(coverType);
    bookCard.appendChild(checkedOut);
    bookCard.appendChild(iconsCell);
    iconsCell.appendChild(editIcon);
    iconsCell.appendChild(removeIcon);
}

function showForm() {
    formContainer.classList.add(`show`);
}

function hideForm() {
    formContainer.classList.remove(`show`);
}