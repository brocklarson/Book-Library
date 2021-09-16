function Book(
    title = "Unknown",
    author = "Unknown",
    coverType = "Unknown",
    checkedOut = false,
    notes = "none",
    bookID = null
) {
    this.title = title
    this.author = author
    this.coverType = coverType
    this.checkedOut = checkedOut
    this.notes = notes
    this.bookID = bookID
}

let myLibrary = [{
    title: `The Hobbit`,
    author: `J.R.R. Tolkien`,
    coverType: `Paperback`,
    checkedOut: false,
    notes: `Rare cover art - Do not lend out.`,
    bookID: 0
}];


const submitButton = document.getElementById(`submitButton`);
const addBookButton = document.getElementById(`addBookButton`);
const exitForm = document.getElementById(`closeForm`);
const exitInfo = document.getElementById(`closeInfo`);
const formContainer = document.getElementById(`formContainer`);
const bookTable = document.getElementById(`tableBody`);
const table = document.querySelector(`table`);
const formBackground = document.getElementById(`formBackground`);
const bookInfoContainer = document.getElementById(`bookInfoContainer`);
const bookCount = document.getElementById(`bookCount`);
const checkedOutCount = document.getElementById(`checkedOutCount`);

initialize();
addBookButton.addEventListener(`click`, showBlankForm);
exitForm.addEventListener(`click`, closeForm);
exitInfo.addEventListener(`click`, closeForm);
formBackground.addEventListener(`click`, closeForm);
table.addEventListener(`click`, handleTableClick);
submitButton.addEventListener(`click`, operate);

function initialize() {
    updateTable();
    updateLog();
}

function operate(event) {
    event.preventDefault();
    if (invalidForm()) {
        return;
    }
    addBookToLibrary();
    closeForm();

    updateTable();
    updateLog();
}

function updateLog() {
    bookCount.innerText = myLibrary.length;
    checkedOutCount.innerText = myLibrary.filter(book => book.checkedOut === true).length;
}

function invalidForm() {
    let invalid = false;
    const invalidIndicator = document.querySelectorAll(`small`);

    for (let i = 0; i < invalidIndicator.length; i++) {
        invalidIndicator[i].classList.remove(`show`);
    }

    if (addBookForm.elements[`bookTitle`].value === ``) {
        document.getElementById('invalidTitle').classList.add(`show`);
        invalid = true;
    }
    if (addBookForm.elements[`bookAuthor`].value === ``) {
        document.getElementById('invalidAuthor').classList.add(`show`);
        invalid = true;
    }
    return invalid;
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
    const notes = addBookForm.elements[`optionalNotes`].value;
    const bookID = myLibrary.indexOf(myLibrary.at(-1)) + 1;
    return new Book(title, author, coverType, checkedOut, notes, bookID);
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
    const viewIconCell = document.createElement(`td`); //
    const viewIcon = document.createElement(`span`);
    const removeIconCell = document.createElement(`td`); //
    const removeIcon = document.createElement(`span`);

    //Matches the book card with the object
    bookCard.dataset.indexNumber = currentBook.bookID;

    bookTitle.innerText = currentBook.title;
    bookAuthor.innerText = currentBook.author;
    coverType.innerText = currentBook.coverType;
    checkedOut.innerText = currentBook.checkedOut ? `Checked Out` : `In Stock`;
    viewIcon.innerText = `visibility`;
    removeIcon.innerText = `close`;

    viewIconCell.classList.add(`icons-cell`);
    removeIconCell.classList.add(`icons-cell`);
    viewIcon.classList.add(`material-icons-outlined`, `view`);
    removeIcon.classList.add(`material-icons-outlined`, `remove`);
    checkedOut.classList.add(`checked-out-cell`);

    bookTable.appendChild(bookCard);
    bookCard.appendChild(bookTitle);
    bookCard.appendChild(bookAuthor);
    bookCard.appendChild(coverType);
    bookCard.appendChild(checkedOut);
    bookCard.appendChild(viewIconCell);
    bookCard.appendChild(removeIconCell);

    viewIconCell.appendChild(viewIcon);
    removeIconCell.appendChild(removeIcon);
}

function showBlankForm() {
    document.getElementById(`bookTitle`).value = ``;
    document.getElementById(`bookAuthor`).value = ``;
    document.getElementById(`coverType`).value = `Paperback`;
    document.getElementById(`optionalNotes`).value = ``;
    document.getElementById(`checkedOutSwitch`).checked = false;
    formContainer.classList.add(`show`);
    formBackground.classList.add(`show`);
}

function closeForm() {
    formContainer.classList.remove(`show`);
    formBackground.classList.remove(`show`);
    bookInfoContainer.classList.remove(`show`);
}

function handleTableClick(event) {
    if (event.target.classList.contains(`remove`)) removeBook(event);
    else if (event.target.classList.contains(`view`)) viewBook(event);
    else if (event.target.classList.contains(`checked-out-cell`)) changeBookStatus(event);
    else if (event.target.nodeName === `TH`) sortTable(event);
}

function changeBookStatus(event) {
    const targetBook = parseInt(event.target.parentNode.dataset.indexNumber);
    if (event.target.innerText === `In Stock`) myLibrary[targetBook].checkedOut = true;
    else myLibrary[targetBook].checkedOut = false;
    updateTable();
    updateLog();
}

function removeBook(event) {
    const targetBook = event.target.parentNode.parentNode;
    myLibrary = myLibrary.filter((book) => book.bookID !== parseInt(targetBook.dataset.indexNumber));
    updateTable();
    updateLog();
}

function viewBook(event) {
    const targetBook = parseInt(event.target.parentNode.parentNode.dataset.indexNumber);
    document.getElementById(`bookInfoID`).innerText = myLibrary[targetBook].bookID;
    document.getElementById(`bookInfoTitle`).innerText = myLibrary[targetBook].title;
    document.getElementById(`bookInfoAuthor`).innerText = myLibrary[targetBook].author;
    document.getElementById(`bookInfoCover`).innerText = myLibrary[targetBook].coverType;
    document.getElementById(`bookInfoStatus`).innerText = myLibrary[targetBook].checkedOut ? `Checked Out` : `In Stock`;
    document.getElementById(`bookInfoNotes`).innerText = myLibrary[targetBook].notes;

    bookInfoContainer.classList.add(`show`);
    formBackground.classList.add(`show`);
}

function sortTable(event) {
    let sorter = `bookID`;
    if (event.target.innerText === ``) return;

    if (event.target.innerText === `Status`) {
        sorter = `checkedOut`;
        myLibrary = myLibrary.sort(function(a, b) {
            if (a[sorter].toString() > b[sorter].toString()) return -1;
            if (a[sorter].toString() === b[sorter].toString()) return 0;
            else return 1;
        });
        updateTable();
        return;
    }


    if (event.target.innerText === `Title`) sorter = `title`;
    else if (event.target.innerText === `Author`) sorter = `author`;
    else if (event.target.innerText === `Cover`) sorter = `coverType`;
    myLibrary = myLibrary.sort(function(a, b) {
        if (a[sorter].toString().toLowerCase() > b[sorter].toString().toLowerCase()) return 1;
        else if (a[sorter].toString().toLowerCase() === b[sorter].toString().toLowerCase()) return 0;
        else return -1;
    });

    updateTable();
}