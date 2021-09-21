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

Book.prototype.checkOut = function() {
    if (this.checkedOut) this.checkedOut = false;
    else this.checkedOut = true;
};

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

//LISTENERS
addBookButton.addEventListener(`click`, showForm);
exitForm.addEventListener(`click`, closeForm);
exitInfo.addEventListener(`click`, closeForm);
formBackground.addEventListener(`click`, closeForm);
table.addEventListener(`click`, handleTableClick);
submitButton.addEventListener(`click`, submitBook);
searchBar.addEventListener('input', updateTable);

//INITIALIZE
let myLibrary = [];

getLocalStorage();
sortLibrary(`ascending`, `bookID`);
updateDisplay();

//UPDATE DISPLAY
function updateDisplay() {
    if (!myLibrary) return;
    updateTable();
    updateLog();
    updateLocalStorage();
}

function updateTable() {
    resetTable();
    const displayLibrary = filterBooks();
    if (!displayLibrary.length) return;
    for (let i = 0; i < displayLibrary.length; i++) {
        createRow(displayLibrary[i]);
    }
}

function resetTable() {
    let i = 0
    while (bookTable.firstChild || i > 10000) {
        i++;
        bookTable.removeChild(bookTable.firstChild);
    }
}

function updateLog() {
    bookCount.innerText = myLibrary.length;
    checkedOutCount.innerText = myLibrary.filter(book => book.checkedOut === true).length;
}

function filterBooks() {
    const search = searchBar.value.toLowerCase();
    return myLibrary.filter(book => (book.title.toLowerCase().includes(search) || book.author.toLowerCase().includes(search)));
}

//HANDLE FORM
function showForm() {
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

function submitBook(event) {
    event.preventDefault();
    if (invalidForm()) return;
    addBookToLibrary();
    closeForm();
    updateDisplay();
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
    if (isDuplicate(newBook)) return;
    myLibrary.unshift(newBook);
}


function isDuplicate(newBook) {
    const duplicateBook = inLibrary(newBook);
    if (duplicateBook) {
        const confirmMessage = `${duplicateBook.title} by ${duplicateBook.author} is already in your Library with a ID of '${duplicateBook.bookID}'.\n\nDo you still want to add this book?`;
        const confirm = window.confirm(confirmMessage);
        if (!confirm) return true;
    }
    return false;
}

function inLibrary(newBook) {
    return myLibrary.find((book) => {
        if (book.title.toLowerCase() === newBook.title.toLowerCase() &&
            book.author.toLowerCase() === newBook.author.toLowerCase()) return true;
    });
}

//NEW BOOKS
function createBook() {
    const title = addBookForm.elements[`bookTitle`].value;
    const author = addBookForm.elements[`bookAuthor`].value;
    const coverType = addBookForm.elements[`coverType`].value;
    const checkedOut = addBookForm.elements[`checkedOutSwitch`].checked;
    const notes = addBookForm.elements[`optionalNotes`].value;
    const bookID = myLibrary.indexOf(myLibrary.at(-1)) + 1;
    return new Book(title, author, coverType, checkedOut, notes, bookID);
}

function createRow(currentBook) {

    const bookRow = document.createElement(`tr`);
    const bookTitle = document.createElement(`td`);
    const bookAuthor = document.createElement(`td`);
    const coverType = document.createElement(`td`);
    const checkedOut = document.createElement(`td`);
    const viewIconCell = document.createElement(`td`);
    const viewIcon = document.createElement(`span`);
    const removeIconCell = document.createElement(`td`);
    const removeIcon = document.createElement(`span`);

    //Matches the book row with the object
    bookRow.dataset.indexNumber = currentBook.bookID;

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

    bookTable.appendChild(bookRow);
    bookRow.appendChild(bookTitle);
    bookRow.appendChild(bookAuthor);
    bookRow.appendChild(coverType);
    bookRow.appendChild(checkedOut);
    bookRow.appendChild(viewIconCell);
    bookRow.appendChild(removeIconCell);

    viewIconCell.appendChild(viewIcon);
    removeIconCell.appendChild(removeIcon);
}

//TABLE FUNCTIONALITY
function handleTableClick(event) {
    if (event.target.classList.contains(`remove`)) removeBook(event);
    else if (event.target.classList.contains(`view`)) viewBookInfo(event);
    else if (event.target.classList.contains(`checked-out-cell`)) changeBookStatus(event);
    else if (event.target.classList.contains(`table-header-text`)) handleSorting(event);
}

function removeBook(event) {
    const targetBook = findBookIndex(event);

    const confirmMessage = `Remove '${myLibrary[targetBook].title}' by '${myLibrary[targetBook].author}' from the library?`;
    const confirm = window.confirm(confirmMessage);
    if (!confirm) return;

    myLibrary.splice(targetBook, 1);
    updateDisplay();
}

function viewBookInfo(event) {
    const targetBook = findBookIndex(event);

    document.getElementById(`bookInfoID`).innerText = myLibrary[targetBook].bookID;
    document.getElementById(`bookInfoTitle`).innerText = myLibrary[targetBook].title;
    document.getElementById(`bookInfoAuthor`).innerText = myLibrary[targetBook].author;
    document.getElementById(`bookInfoCover`).innerText = myLibrary[targetBook].coverType;
    document.getElementById(`bookInfoStatus`).innerText = myLibrary[targetBook].checkedOut ? `Checked Out` : `Available`;
    document.getElementById(`bookInfoNotes`).innerText = myLibrary[targetBook].notes;

    bookInfoContainer.classList.add(`show`);
    formBackground.classList.add(`show`);
}

function changeBookStatus(event) {
    const targetBook = findBookIndex(event);
    myLibrary[targetBook].checkOut();
    updateDisplay();
}

function findBookIndex(event) {
    let rowIndexNumber = parseInt(event.target.parentNode.dataset.indexNumber);
    if (event.target.tagName.toLowerCase() === `span`) {
        rowIndexNumber = parseInt(event.target.parentNode.parentNode.dataset.indexNumber);
    }
    return myLibrary.findIndex(book => book.bookID === rowIndexNumber);
}

function handleSorting(event) {
    if (event.target.innerText === ``) return;
    const sortParam = getSortParameter(event);
    const sortDirection = getSortDirection(event);
    sortLibrary(sortDirection, sortParam);
    updateDisplay();
}

function getSortParameter(event) {
    if (event.target.innerText === `Status`) return `checkedOut`;
    else if (event.target.innerText === `Title`) return `title`;
    else if (event.target.innerText === `Author`) return `author`;
    else if (event.target.innerText === `Cover`) return `coverType`;
    else return `BookID`;
}

function getSortDirection(event) {
    const sortArrow = event.target.parentNode.lastElementChild;
    const resetArrows = document.querySelectorAll(`.header-arrow`);

    for (let i = 0; i < resetArrows.length; i++) {
        if (sortArrow !== resetArrows[i]) {
            resetArrows[i].innerText = ``;
        }
    }

    if (sortArrow.innerText === `` || sortArrow.innerText === `expand_more`) {
        sortArrow.innerText = `expand_less`;
        return `ascending`;
    } else {
        sortArrow.innerText = `expand_more`;
        return `descending`;
    }
}

function sortLibrary(sortDirection, sortParam) {
    if (sortDirection === `ascending`) {
        myLibrary = myLibrary.sort(function(a, b) {
            if (a[sortParam].toString().toLowerCase() > b[sortParam].toString().toLowerCase()) return 1;
            else if (a[sortParam].toString().toLowerCase() === b[sortParam].toString().toLowerCase()) return 0;
            else return -1;
        });
    } else if (sortDirection === `descending`) {
        myLibrary = myLibrary.sort(function(a, b) {
            if (a[sortParam].toString().toLowerCase() > b[sortParam].toString().toLowerCase()) return -1;
            else if (a[sortParam].toString().toLowerCase() === b[sortParam].toString().toLowerCase()) return 0;
            else return 1;
        });
    }
}

// LOCAL STORAGE //
function updateLocalStorage() {
    if (storageAvailable('localStorage')) {
        localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
    }
}

function getLocalStorage() {
    if (storageAvailable('localStorage')) {
        if (localStorage.getItem('myLibrary')) {
            myLibrary = [];
            storageLibrary = JSON.parse(localStorage.getItem('myLibrary'));
            storageLibrary.forEach((book) => {
                const newBook = new Book(book.title, book.author, book.coverType, book.checkedOut, book.notes, book.bookID);
                myLibrary.push(newBook);
            });
        } else useMyLibrary();
    } else useMyLibrary();
}

function storageAvailable(type) {
    let storage;
    try {
        storage = window[type];
        let x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return e instanceof DOMException && (
                // everything except Firefox
                e.code === 22 ||
                // Firefox
                e.code === 1014 ||
                // test name field too, because code might not be present
                // everything except Firefox
                e.name === 'QuotaExceededError' ||
                // Firefox
                e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}

function useMyLibrary() {
    bookList.forEach((book) => { //from bookList.js
        const newBook = new Book(book.title, book.author, book.coverType, book.checkedOut, book.notes, book.bookID);
        myLibrary.push(newBook);
    });
}