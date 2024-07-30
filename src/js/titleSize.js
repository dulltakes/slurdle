const getScreenWidth = () => {
    window.addEventListener('resize', () => {
        console.log(window.innerWidth);
    })
}

export default getScreenWidth