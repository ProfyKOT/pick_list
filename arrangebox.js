class ArrangeBox {
    constructor(availableList){
        this.startedList = [].concat(availableList)
        this.availableList = availableList
        this.selectedList = []
        this.selectedElem
        this.mainElem = document.createElement('div');
        this.mainElem.className = 'main-elem';
        let buttons = '<div class="button" data-role = "up">&rsaquo;</div><div class="button" data-role = "allup">&raquo</div><div class="button" data-role = "down">&lsaquo;</div><div class="button" data-role = "alldown">&laquo</div>'
        let buttonsChanged = '<div class="button move-buttons-center_center" data-role = "ats">&rsaquo;</div><div class="button move-buttons-center_center" data-role = "superats">&raquo;</div><div class="button move-buttons-center_center" data-role = "sta">&lsaquo;</div><div class="button move-buttons-center_center" data-role = "supersta">&laquo;</div>'
        let testBar = '<div class="test-elem"><div data-role = "allReset" class="button move-buttons-center_center button-test">Сброс</div><input type="text" value="http://localhost:9000" placeholder="Адрес сервера" class="other-input button-test"><div class="button move-buttons-center_center button-test" data-role = "uploadToServer">Загрузить на сервер</div><div class="button move-buttons-center_center button-test" data-role = "downloadFromServer">Выгрузить с сервера</div></div>'
        let allElems = testBar + '<div class="bottom-main">' + this.buttonsInit(buttons,'leftbut') + this.listBlockInit('Available',this.availableListInit(this.availableList),'availableInput') + this.buttonsInit(buttonsChanged,'centerbut') + this.listBlockInit('Selected',this.selectedListInit(this.selectedList),'selectedInput') + this.buttonsInit(buttons,'rightbut') + '</div>'
        this.mainElem.innerHTML = allElems
        this.listObj = Array.from(this.mainElem.querySelectorAll('.content-block'))
        for(let i in this.listObj){
            this.listObj[i].addEventListener('click',(event) => this.selectElem(event))
        }
        this.currentElem = this.mainElem
        document.querySelector('.main').append(this.mainElem)
        this.eventInit()
    }
    allReset(){
        this.availableList = this.startedList
        this.selectedList = []
        this.againInit()
    }
    uploadToServer(){
        let serverAddressField = this.mainElem.querySelector('.test-elem input').value
        let dataInJson = JSON.stringify({
            availableList: this.availableList,
            selectedList: this.selectedList,
        })
        fetch(serverAddressField,{
            method: 'post',
            headers:{
                "Content-Type":'application/json;charset=utf-8'
            },
            body: dataInJson
        })
    }
    async downloadFromServer(){
        let serverAddressField = this.mainElem.querySelector('.test-elem input').value
        let response = await fetch(serverAddressField)
        if(response.ok){
            let responseJson = await response.json()
            this.availableList = responseJson.availableList
            this.selectedList = responseJson.selectedList
            this.againInit()
        }
    }
    againInit(newIndex,listAvailab = this.availableList,listSelected = this.selectedList){
        let initList = this.mainElem.querySelectorAll('.content-block')
        initList = Array.from(initList)
        initList[0].innerHTML = this.availableListInit(listAvailab)
        initList[1].innerHTML = this.selectedListInit(listSelected)
        this.selectedElem = undefined
    }
    buttonsInit(buttons,position){
        let moveButtonsCenter = '<div class="move-buttons-center '+position+'">' + buttons + '</div>'
        let moveButtons = '<div class="move-buttons">' + moveButtonsCenter + '</div>'
        return moveButtons
    }
    listBlockInit(headerText,listElems,formIn){
        let headerBlock = '<div class="header"><span>' + headerText + '</span></div>'
        let searchBlock = '<div class="search-block"><input type="text" class = "' + formIn + '" placeholder="Search by name"></div>'
        let contentBlock = '<div class="content-block">' + listElems + '</div>'
        return '<div class="list">' + headerBlock + searchBlock + contentBlock + '</div>'
    }
    availableListInit(list){
        let availableListLoc = new String()
        list.forEach((item,index,array) => {
            availableListLoc += '<div class="list-elem list-hover" data-index="' + index + '" data-array="available"><span>' + item + '</span></div>'
        });
        if(availableListLoc){
            return availableListLoc
        }
        return ''
    }
    selectedListInit(list){
        let selectedListLoc = new String()
        list.forEach((item,index,array) => {
            selectedListLoc += '<div class="list-elem list-hover" data-index="' + index + '" data-array="selected"><span>' + item + '</span></div>'
        });
        if(selectedListLoc){
            return selectedListLoc
        }
        return ''
    }
    searchInAvailable(){
        let searchWord = this.mainElem.querySelector('.availableInput').value
        if(this.availableList){
            searchWord = RegExp(searchWord)
            this.searchedArrayInAv = this.availableList.filter(item => String(item).match(searchWord))
            let initList = this.mainElem.querySelectorAll('.content-block')
            initList = Array.from(initList)
            initList[0].innerHTML = this.availableListInit(this.searchedArrayInAv)
        }
        this.selectedElem = undefined
    }
    searchInSelected(){
        let searchWord = this.mainElem.querySelector('.selectedInput').value
        if(this.selectedList){
            searchWord = RegExp(searchWord)
            this.searchedArrayInSel = this.selectedList.filter(item => String(item).match(searchWord))
            let initList = this.mainElem.querySelectorAll('.content-block')
            initList = Array.from(initList)
            initList[1].innerHTML = this.selectedListInit(this.searchedArrayInSel)
        }
        this.selectedElem = undefined
    }
    eventInit(){
        let buttonsLeft = this.currentElem.querySelector('.leftbut')
        buttonsLeft = Array.from(buttonsLeft.querySelectorAll('.button'))
        let buttonsCenter = this.currentElem.querySelector('.centerbut')
        buttonsCenter = Array.from(buttonsCenter.querySelectorAll('.button'))
        let buttonsRight = this.currentElem.querySelector('.rightbut')
        buttonsRight = Array.from(buttonsRight.querySelectorAll('.button'))
        for(let i in buttonsLeft){
            if(buttonsLeft[i].getAttribute('data-role') == 'up'){
                buttonsLeft[i].addEventListener('click',() => this.moveUpLeft())
            }
            else if(buttonsLeft[i].getAttribute('data-role') == 'allup'){
                buttonsLeft[i].addEventListener('click',() => this.moveSuperUpLeft())
            }
            else if(buttonsLeft[i].getAttribute('data-role') == 'down'){
                buttonsLeft[i].addEventListener('click',() => this.moveDownLeft())
            }
            else if(buttonsLeft[i].getAttribute('data-role') == 'alldown'){
                buttonsLeft[i].addEventListener('click',() => this.moveSuperDownLeft())
            }
        }
        for(let i in buttonsCenter){
            if(buttonsCenter[i].getAttribute('data-role') == 'ats'){
                buttonsCenter[i].addEventListener('click',() => this.moveToSelected())
            }
            else if(buttonsCenter[i].getAttribute('data-role') == 'superats'){
                buttonsCenter[i].addEventListener('click',() => this.allMoveToSelected())
            }
            else if(buttonsCenter[i].getAttribute('data-role') == 'sta'){
                buttonsCenter[i].addEventListener('click',() => this.moveToAvailable())
            }
            else if(buttonsCenter[i].getAttribute('data-role') == 'supersta'){
                buttonsCenter[i].addEventListener('click',() => this.allMoveToAvailable())
            }
        }
        for(let i in buttonsRight){
            if(buttonsRight[i].getAttribute('data-role') == 'up'){
                buttonsRight[i].addEventListener('click',() => this.moveUpRight())
            }
            else if(buttonsRight[i].getAttribute('data-role') == 'allup'){
                buttonsRight[i].addEventListener('click',() => this.moveSuperUpRight())
            }
            else if(buttonsRight[i].getAttribute('data-role') == 'down'){
                buttonsRight[i].addEventListener('click',() => this.moveDownRight())
            }
            else if(buttonsRight[i].getAttribute('data-role') == 'alldown'){
                buttonsRight[i].addEventListener('click',() => this.moveSuperDownRight())
            }
        }
        let inputInAvailable = this.mainElem.querySelector('.availableInput')
        let inputInSelected = this.mainElem.querySelector('.selectedInput')
        inputInAvailable.addEventListener('input',() => this.searchInAvailable())
        inputInSelected.addEventListener('input',() => this.searchInSelected())
        let allResetButton = this.mainElem.querySelector('[data-role=allReset]')
        allResetButton.addEventListener('click',() => this.allReset())
        let uploadToServerButton = this.mainElem.querySelector('[data-role=uploadToServer]')
        uploadToServerButton.addEventListener('click',() => this.uploadToServer())
        let downloadFromServerButton = this.mainElem.querySelector('[data-role=downloadFromServer]')
        downloadFromServerButton.addEventListener('click',() => this.downloadFromServer())
    }
    selectElem(event){
        let target = event.target
        if(target.classList.contains('list-elem')){
            if (this.selectedElem){
                this.selectedElem.classList.remove('list-select')
                this.selectedElem.classList.add('list-hover')
            }
            this.selectedElem = target
            this.selectedElem.classList.add('list-select')
            this.selectedElem.classList.remove('list-hover')
        }
    }
    moveUpLeft(){
        if(!this.selectedElem){
            return
        }
        let currentIndex = Number(this.selectedElem.getAttribute('data-index'))
        if(currentIndex == 0 || this.selectedElem.getAttribute('data-array') == 'selected'){
            return
        }
        else{
            [this.availableList[currentIndex], this.availableList[currentIndex - 1]] = [this.availableList[currentIndex - 1],this.availableList[currentIndex]]
            this.againInit(currentIndex - 1)
        }
    }
    moveSuperUpLeft(){
        if(!this.selectedElem){
            return
        }
        let currentIndex = Number(this.selectedElem.getAttribute('data-index'))
        if(currentIndex == 0 || this.selectedElem.getAttribute('data-array') == 'selected'){
            return
        }
        else{
            [this.availableList[currentIndex], this.availableList[0]] = [this.availableList[0],this.availableList[currentIndex]]
            this.againInit(0)
        }
    }
    moveDownLeft(){
        if(!this.selectedElem){
            return
        }
        let currentIndex = Number(this.selectedElem.getAttribute('data-index'))
        if(currentIndex == this.availableList.length - 1 || this.selectedElem.getAttribute('data-array') == 'selected'){
            return
        }
        else{
            [this.availableList[currentIndex], this.availableList[currentIndex + 1]] = [this.availableList[currentIndex + 1],this.availableList[currentIndex]]
            this.againInit(currentIndex + 1)
        }
    }
    moveSuperDownLeft(){
        if(!this.selectedElem){
            return
        }
        let currentIndex = Number(this.selectedElem.getAttribute('data-index'))
        if(currentIndex == this.availableList.length - 1 || this.selectedElem.getAttribute('data-array') == 'selected'){
            return
        }
        else{
            [this.availableList[currentIndex], this.availableList[this.availableList.length - 1]] = [this.availableList[this.availableList.length - 1],this.availableList[currentIndex]]
            this.againInit(this.availableList.length - 1)
        }
    }
    moveUpRight(){
        if(!this.selectedElem){
            return
        }
        let currentIndex = Number(this.selectedElem.getAttribute('data-index'))
        if(currentIndex == 0 || this.selectedElem.getAttribute('data-array') == 'available'){
            return
        }
        else{
            [this.selectedList[currentIndex], this.selectedList[currentIndex - 1]] = [this.selectedList[currentIndex - 1],this.selectedList[currentIndex]]
            this.againInit(currentIndex - 1)
        }
    }
    moveSuperUpRight(){
        if(!this.selectedElem){
            return
        }
        let currentIndex = Number(this.selectedElem.getAttribute('data-index'))
        if(currentIndex == 0 || this.selectedElem.getAttribute('data-array') == 'available'){
            return
        }
        else{
            [this.selectedList[currentIndex], this.selectedList[0]] = [this.selectedList[0],this.selectedList[currentIndex]]
            this.againInit(0)
        }
    }
    moveDownRight(){
        if(!this.selectedElem){
            return
        }
        let currentIndex = Number(this.selectedElem.getAttribute('data-index'))
        if(currentIndex == this.selectedList.length - 1 || this.selectedElem.getAttribute('data-array') == 'available'){
            return
        }
        else{
            [this.selectedList[currentIndex], this.selectedList[currentIndex + 1]] = [this.selectedList[currentIndex + 1],this.selectedList[currentIndex]]
            this.againInit(currentIndex + 1)
        }
    }
    moveSuperDownRight(){
        if(!this.selectedElem){
            return
        }
        let currentIndex = Number(this.selectedElem.getAttribute('data-index'))
        if(currentIndex == this.selectedList.length - 1 || this.selectedElem.getAttribute('data-array') == 'available'){
            return
        }
        else{
            [this.selectedList[currentIndex], this.selectedList[this.selectedList.length - 1]] = [this.selectedList[this.selectedList.length - 1],this.selectedList[currentIndex]]
            this.againInit(this.selectedList.length - 1)
        }
    }
    moveToSelected(){
        if(!this.selectedElem){
            return
        }
        let currentIndex = Number(this.selectedElem.getAttribute('data-index'))
        if(this.selectedElem.getAttribute('data-array') == 'selected'){
            return
        }
        else{
            this.selectedList.push(this.availableList.splice(currentIndex,1))
            this.againInit(this.selectedList.length - 1)
        }
    }
    moveToAvailable(){
        if(!this.selectedElem){
            return
        }
        let currentIndex = Number(this.selectedElem.getAttribute('data-index'))
        if(this.selectedElem.getAttribute('data-array') == 'available'){
            return
        }
        else{
            this.availableList.push(this.selectedList.splice(currentIndex,1))
            this.againInit(this.availableList.length - 1)
        }
    }
    allMoveToSelected(){
        if(!this.availableList){
            return
        }
        else{
            this.selectedList = this.selectedList.concat(this.availableList)
            this.availableList = []
            this.againInit()
        }
    }
    allMoveToAvailable(){
        if(!this.selectedList){
            return
        }
        else{
            this.availableList = this.availableList.concat(this.selectedList)
            this.selectedList = []
            this.againInit()
        }
    }
}
let t = new ArrangeBox(['Block 1','Block 2','Block 3','Block 4','Block 5','Block 6','Block 7','Block 8','Block 9','Block 10','Block 11','Block 12','Block 13','Block 14','Block 15']);