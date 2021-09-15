function Book(
    title = "Unknown",
    author = "Unknown",
    coverType = "Unknown",
    checkedOut = false,
    comments = "none",
    bookID = null
) {
    this.title = title
    this.author = author
    this.coverType = coverType
    this.checkedOut = checkedOut
    this.comments = comments
    this.bookID = bookID
}

let myLibrary = [{
    title: `The Hobbit`,
    author: `J.R.R. Tolkien`,
    coverType: `Paperback`,
    checkedOut: false,
    comments: `Rare cover art - Do not lend out.`,
    bookID: 0
}];

const submitButton = document.getElementById(`submitButton`);
const addBookButton = document.getElementById(`addBookButton`);
const exitForm = document.getElementById(`closeForm`);
const formContainer = document.getElementById(`formContainer`);
const bookTable = document.getElementById(`tableBody`);
const table = document.querySelector(`table`);


updateTable();
addBookButton.addEventListener(`click`, showBlankForm);
exitForm.addEventListener(`click`, closeForm);
table.addEventListener(`click`, handleTableClick);

function operate(event) {
    submitButton.removeEventListener(`click`, operate);

    event.preventDefault();
    addBookToLibrary();
    closeForm();
    updateTable();
}

function addBookToLibrary() {
    const newBook = createBook();
    if (inLibrary(newBook)) {
        const duplicateBook = getDuplicateBook(newBook);
        let confirmMessage = `${duplicateBook.title} by ${duplicateBook.author} is already in your Library with a ID of '${duplicateBook.bookID}'.\n\nDo you still want to add this book?`;
        const confirm = window.confirm(confirmMessage);
        if (!confirm) return;
    }
    myLibrary.push(newBook);
}

function getDuplicateBook(newBook) {
    return myLibrary.find((book) => {
        if (book.title.toLowerCase() === newBook.title.toLowerCase() &&
            book.author.toLowerCase() === newBook.author.toLowerCase()) return true;
    });
}

function inLibrary(newBook) {
    return myLibrary.some((book) => {
        if (book.title.toLowerCase() === newBook.title.toLowerCase() &&
            book.author.toLowerCase() === newBook.author.toLowerCase()) return true;
    });
}

function createBook() {
    const title = addBookForm.elements[`bookTitle`].value;
    const author = addBookForm.elements[`bookAuthor`].value;
    const coverType = addBookForm.elements[`coverType`].value;
    const checkedOut = addBookForm.elements[`checkedOutSwitch`].checked;
    const comments = addBookForm.elements[`optionalComments`].value;
    const bookID = myLibrary.indexOf(myLibrary.at(-1)) + 1;
    return new Book(title, author, coverType, checkedOut, comments, bookID);
}

function updateTable() {
    removeAllRows()
    if (!myLibrary.length) return;
    for (let i = 0; i < myLibrary.length; i++) {
        createCard(myLibrary[i]);
    }
}

function removeAllRows() {
    let i = 0
    while (bookTable.firstChild || i > 10000) {
        i++;
        bookTable.removeChild(bookTable.firstChild);
    }
}

function createCard(currentBook) {

    const bookCard = document.createElement(`tr`);
    const bookTitle = document.createElement(`td`);
    const bookAuthor = document.createElement(`td`);
    const coverType = document.createElement(`td`);
    const checkedOut = document.createElement(`td`);
    const iconsCell = document.createElement(`td`);
    const editIcon = document.createElement(`span`);
    const removeIcon = document.createElement(`span`);

    //Matches the book card with the object
    bookCard.dataset.indexNumber = currentBook.bookID;

    bookTitle.innerText = currentBook.title;
    bookAuthor.innerText = currentBook.author;
    coverType.innerText = currentBook.coverType;
    checkedOut.innerText = currentBook.checkedOut ? `Checked Out` : `In Stock`;
    editIcon.innerText = `edit`;
    removeIcon.innerText = `close`;

    iconsCell.classList.add(`icons-cell`);
    editIcon.classList.add(`material-icons-outlined`, `edit`);
    removeIcon.classList.add(`material-icons-outlined`, `remove`);
    checkedOut.classList.add(`checked-out-cell`);

    bookTable.appendChild(bookCard);
    bookCard.appendChild(bookTitle);
    bookCard.appendChild(bookAuthor);
    bookCard.appendChild(coverType);
    bookCard.appendChild(checkedOut);
    bookCard.appendChild(iconsCell);
    iconsCell.appendChild(editIcon);
    iconsCell.appendChild(removeIcon);
}

function showBlankForm() {
    submitButton.addEventListener(`click`, operate);

    document.getElementById(`bookTitle`).value = ``;
    document.getElementById(`bookAuthor`).value = ``;
    document.getElementById(`coverType`).value = `Paperback`;
    document.getElementById(`optionalComments`).value = ``;
    document.getElementById(`checkedOutSwitch`).checked = false;
    formContainer.classList.add(`show`);
}

function closeForm() {
    submitButton.removeEventListener(`click`, operate);
    // submitButton.removeEventListener(`click`, updateBooks);

    formContainer.classList.remove(`show`);
}

function handleTableClick(event) {
    if (event.target.classList.contains(`remove`)) removeBook(event);
    // else if (event.target.classList.contains(`edit`)) editBook(event);
    else if (event.target.classList.contains(`checked-out-cell`)) changeBookStatus(event);
}

function changeBookStatus(event) {
    const targetBook = parseInt(event.target.parentNode.dataset.indexNumber);
    if (event.target.innerText === `In Stock`) myLibrary[targetBook].checkedOut = true;
    else myLibrary[targetBook].checkedOut = false;
    updateTable();
}

function removeBook(event) {
    const targetBook = event.target.parentNode.parentNode;
    myLibrary = myLibrary.filter((book) => book.bookID !== parseInt(targetBook.dataset.indexNumber));
    updateTable();
}

// function editBook(event) {
//     const targetBook = parseInt(event.target.parentNode.parentNode.dataset.indexNumber);

//     document.getElementById(`bookTitle`).value = myLibrary[targetBook].title;
//     document.getElementById(`bookAuthor`).value = myLibrary[targetBook].author;
//     document.getElementById(`coverType`).value = myLibrary[targetBook].coverType;
//     document.getElementById(`optionalComments`).value = myLibrary[targetBook].comments;
//     document.getElementById(`checkedOutSwitch`).checked = myLibrary[targetBook].checkedOut;
//     formContainer.classList.add(`show`);
//     submitButton.addEventListener(`click`, () => updateBooks(targetBook));

// }

// function updateBooks(targetBook) {
//     myLibrary[targetBook].title = addBookForm.elements[`bookTitle`].value;
//     myLibrary[targetBook].author = addBookForm.elements[`bookAuthor`].value;
//     myLibrary[targetBook].coverType = addBookForm.elements[`coverType`].value;
//     myLibrary[targetBook].comments = addBookForm.elements[`optionalComments`].value;
//     myLibrary[targetBook].checkedOut = addBookForm.elements[`checkedOutSwitch`].checked;
//     closeForm();
//     updateTable();
// }