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

let myLibrary = bookList.splice(0); ///From bookList.js

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


const searchBar = document.getElementById(`searchBar`);

searchBar.addEventListener('input', bookSearch);

function bookSearch() {
    const search = searchBar.value.toLowerCase();
    const dispLibrary = myLibrary.filter(book => (book.title.toLowerCase().includes(search) || book.author.toLowerCase().includes(search)));
    updateTable(dispLibrary);
}


initialize();
addBookButton.addEventListener(`click`, showBlankForm);
exitForm.addEventListener(`click`, closeForm);
exitInfo.addEventListener(`click`, closeForm);
formBackground.addEventListener(`click`, closeForm);
table.addEventListener(`click`, handleTableClick);
submitButton.addEventListener(`click`, operate);

function initialize() {
    updateTable(myLibrary);
    updateLog();
}

function operate(event) {
    event.preventDefault();
    if (invalidForm()) {
        return;
    }
    addBookToLibrary();
    closeForm();

    updateTable(myLibrary);
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
        const duplicateBook = inLibrary(newBook);
        let confirmMessage = `${duplicateBook.title} by ${duplicateBook.author} is already in your Library with a ID of '${duplicateBook.bookID}'.\n\nDo you still want to add this book?`;
        const confirm = window.confirm(confirmMessage);
        if (!confirm) return;
    }

    myLibrary.unshift(newBook);
}

function inLibrary(newBook) {
    return myLibrary.find((book) => {
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

function updateTable(myLibrary) {
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
    const viewIconCell = document.createElement(`td`);
    const viewIcon = document.createElement(`span`);
    const removeIconCell = document.createElement(`td`);
    const removeIcon = document.createElement(`span`);

    //Matches the book card with the object
    bookCard.dataset.indexNumber = currentBook.bookID;

    bookTitle.innerText = currentBook.title;
    bookAuthor.innerText = currentBook.author;
    coverType.innerText = currentBook.coverType;
    checkedOut.innerText = currentBook.checkedOut ? `Checked Out` : `Available`;
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
    else if (event.target.classList.contains(`table-header-text`)) sortTable(event);
}

function changeBookStatus(event) {
    const rowIndexNumber = parseInt(event.target.parentNode.dataset.indexNumber);
    const targetBook = myLibrary.findIndex(book => book.bookID === rowIndexNumber);

    if (event.target.innerText === `Available`) myLibrary[targetBook].checkedOut = true;
    else myLibrary[targetBook].checkedOut = false;
    updateTable(myLibrary);
    updateLog();
}

function removeBook(event) {
    const targetBook = event.target.parentNode.parentNode;
    myLibrary = myLibrary.filter((book) => book.bookID !== parseInt(targetBook.dataset.indexNumber));
    updateTable(myLibrary);
    updateLog();
}

function viewBook(event) {
    const rowIndexNumber = parseInt(event.target.parentNode.parentNode.dataset.indexNumber);
    const targetBook = myLibrary.findIndex(book => book.bookID === rowIndexNumber);

    document.getElementById(`bookInfoID`).innerText = myLibrary[targetBook].bookID;
    document.getElementById(`bookInfoTitle`).innerText = myLibrary[targetBook].title;
    document.getElementById(`bookInfoAuthor`).innerText = myLibrary[targetBook].author;
    document.getElementById(`bookInfoCover`).innerText = myLibrary[targetBook].coverType;
    document.getElementById(`bookInfoStatus`).innerText = myLibrary[targetBook].checkedOut ? `Checked Out` : `Available`;
    document.getElementById(`bookInfoNotes`).innerText = myLibrary[targetBook].notes;

    bookInfoContainer.classList.add(`show`);
    formBackground.classList.add(`show`);
}

function getSortDirection(event) {
    const headerArrow = event.target.parentNode.lastElementChild;
    const resetArrows = document.querySelectorAll(`.header-arrow`);


    for (let i = 0; i < resetArrows.length; i++) {
        if (headerArrow !== resetArrows[i]) {
            resetArrows[i].innerText = ``;
        }
    }

    if (headerArrow.innerText === `` || headerArrow.innerText === `expand_more`) {
        headerArrow.innerText = `expand_less`;
        return `ascending`;
    } else if (headerArrow.innerText === `expand_less`) {
        headerArrow.innerText = `expand_more`;
        return `descending`;
    }
}

function getSorter(event) {
    if (event.target.innerText === `Status`) return `checkedOut`;
    else if (event.target.innerText === `Title`) return `title`;
    else if (event.target.innerText === `Author`) return `author`;
    else if (event.target.innerText === `Cover`) return `coverType`;
}

function sortTable(event) {
    if (event.target.innerText === ``) return;
    let sorter = getSorter(event);
    const sortDirection = getSortDirection(event);

    switch (sortDirection) {
        case `ascending`:
            myLibrary = myLibrary.sort(function(a, b) {
                if (a[sorter].toString().toLowerCase() > b[sorter].toString().toLowerCase()) return 1;
                else if (a[sorter].toString().toLowerCase() === b[sorter].toString().toLowerCase()) return 0;
                else return -1;
            });
            break;
        case `descending`:
            myLibrary = myLibrary.sort(function(a, b) {
                if (a[sorter].toString().toLowerCase() > b[sorter].toString().toLowerCase()) return -1;
                else if (a[sorter].toString().toLowerCase() === b[sorter].toString().toLowerCase()) return 0;
                else return 1;
            });
            break;
    }
    updateTable(myLibrary);
}