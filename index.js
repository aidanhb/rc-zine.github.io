'use strict';

var imageMap = {};
var onPhone = false;
var iPhoneMediaQuery = "only screen and (min-device-width : 375px) and (max-device-width : 812px)";

function getImage(image_url) {
    var promise = new Promise(function(resolve) {
        let img = new Image();
        img.src = image_url;
        img.onload = function() {
            resolve(img.width > 0);
        }
        img.onerror = function() {
            resolve(false);
        }
    });
    return promise;
}

async function imageExists(image_url) {
    if (!(image_url in imageMap)) {
        let prom = await getImage(image_url);
        imageMap[image_url] = prom;
    }
    console.log(imageMap[image_url]);
    return imageMap[image_url];
}

function get_img_path(volume, page) {
    return `images/volume${volume}_pg${page}.png`;
}

function create_img(volume, page) {
    return <img src={get_img_path(volume, page)} className="page" key={page - 1}/>
}

class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            prevIndex: null,
            pageIndex: 0,
            pages: [],
        }
        this.handleKey = this.handleKey.bind(this);
    }

    handleKey(e) {
        var event = window.event ? window.event : e;
        if (event.keyCode == 37) {
            this.plusPage(-2);
        } else if (event.keyCode == 39) {
            this.plusPage(2);
        } else if (event.key === "Escape") {
            this.props.handleClose();
        }
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKey, false);
    }

    async componentDidMount() {
        document.addEventListener("keydown", this.handleKey, false);
        if (onPhone) {
            await this.loadPages(1000);
        } else {
            await this.loadPages(8);
        }
    }

    async loadPages(end) {
        if (end >= this.state.pages.length) {
            console.log(`${end} is greater than ${this.state.pages.length}`);
            let to_concat = [];
            let start = this.state.pages.length;
            for ( var i = start + 1; i <= end; i ++ ) {
                if (await imageExists(get_img_path(this.props.volumeIndex, i))) {
                    to_concat.push(create_img(this.props.volumeIndex, i));
                } else {
                    console.log(`Page ${i} doesnt exist. Breaking!`);
                    break;
                }
            }
            this.setState({ pages: this.state.pages.concat(to_concat) });
        }
    }

    async plusPage(num) {
        let index = this.state.pageIndex + num;
        if (0 <= index) {
            await this.loadPages(index + 8);
            if (index <= this.state.pages.length - 2) {
                this.setState({ prevIndex: this.state.pageIndex, pageIndex: index });
            }
        }
    }

    render() {
        return (
            <section className="modal" id="modal-viewer">
                <span className="close cursor" id="close" onClick={this.props.handleClose}>&times;</span>
    
                <div className="modal-content" id="modal-contact">
                    <div className="volume-contents">
                        <div className="pages">
                            {(onPhone || this.state.prevIndex == null)? null : this.state.pages.slice(this.state.prevIndex, this.state.prevIndex + 2)}
                        </div>
                        <div className="pages">
                            {(onPhone)? this.state.pages : this.state.pages.slice(this.state.pageIndex, this.state.pageIndex + 2)}
                        </div>
                    </div>
                </div>
                {(this.state.pageIndex > 0)? <a className="prev" id="prev" onClick={e => this.plusPage(-2)}>&#10094;</a> : null}
                {(this.state.pageIndex < this.state.pages.length - 2)? <a className="next" id="next" onClick={e => this.plusPage(2)}>&#10095;</a> : null}
            </section>
        );
    }
}

class VolumeViewer extends React.Component {
    constructor(props) {
       super(props);
       this.state = {
            volumeIndex: null,
            numVols: 2,
       };
       console.log("making a colume viewer");
       this.countVols();
    }

    async countVols() {
        let count = 0;
        while (true) {
            let imagePath = `images/volume${count + 1}_cover.png`;
            if (await imageExists(imagePath)) {
                count += 1;
            } else {
                break;
            }
        }
        this.setState({ numVols: count });
    }

    showModal(i) {
        this.setState({ volumeIndex: i });
    }

    hideModal() {
        this.setState({ volumeIndex: null });
    }

    renderCover(i) {
        let badge = (
            <div className="badge">
                <div className="link">
                    <a href="https://github.com/aidanhb/zine-formatter" className="githubLink">
                        Made with the Zine Formatter!
                    </a>
                </div>
            </div>)

        return (
            <div className="volume" key={i}>
                {(i >= 3)? badge: null}
                <img src={`images/volume${i}_cover.png`} className="cover" onClick={e => { this.showModal(i) }} />
                <a href={`downloads/volume${i}.zip`} className="download" download>
                    Download PDF
                </a>
            </div>
        );
    }

    render() {
        const covers = []

        for ( var i = 1; i <= this.state.numVols; i ++ ) {
            covers.push(this.renderCover(i))
        }

        let modal = (<Modal volumeIndex={this.state.volumeIndex}
                            handleClose={() => this.hideModal()}>
                     </Modal>)

        return (
            <div>
                <section className="volumes">
                    {covers}
                </section>
                {(this.state.volumeIndex != null)? modal : null}     
            </div>
        );
    }
}

function load(e) {
    onPhone = window.matchMedia(iPhoneMediaQuery).matches;
    console.log(onPhone);
    const domContainer = document.getElementById('volume_viewer');
    ReactDOM.render(React.createElement(VolumeViewer), domContainer);
}

$(load);