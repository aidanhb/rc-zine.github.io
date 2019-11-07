'use strict';

var imageMap = {};

async function imageExists(image_url) {
    if (!(image_url in imageMap)) {
        let response = await fetch(image_url);
        imageMap[image_url] = response.ok;
    }
    return imageMap[image_url];
}

class Modal extends React.Component {
    constructor(props) {
       super(props);
       this.state = {
            pageIndex: 1,
            pageOne: `images/volume${this.props.volumeIndex}_pg${1}.png`,
            pageTwo: `images/volume${this.props.volumeIndex}_pg${2}.png`,
       }
    }

    async plusPage(num) {
        let page = this.state.pageIndex + num;
        if (await imageExists(`images/volume${this.props.volumeIndex}_pg${page}.png`)) {
            this.setState({ pageOne: `images/volume${this.props.volumeIndex}_pg${page}.png` });
            this.setState({ pageIndex: page });
            if (await imageExists(`images/volume${this.props.volumeIndex}_pg${page + 1}.png`)) {
                this.setState({ pageTwo: `images/volume${this.props.volumeIndex}_pg${page + 1}.png` });
            } else {
                this.setState({ pageTwo: null });
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
                            <img src={this.state.pageOne} className="page" />
                            {this.state.pageTwo != null && <img src={this.state.pageTwo} className="page" />}
                        </div>
                    </div>
                </div>
    
                <a className="prev" id="prev" onClick={e => this.plusPage(-2)}>&#10094;</a>
                <a className="next" id="next" onClick={e => this.plusPage(2)}>&#10095;</a>
            </section>
        );
    }
}

class VolumeViewer extends React.Component {
    constructor(props) {
       super(props);
       this.state = {
            volumeIndex: null,
            showModal: false,
            numVols: 2,
       };
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
        console.log(this.state.numVols);
    }

    showModal(i) {
        this.setState({ volumeIndex: i });
    }

    hideModal() {
        this.setState({ volumeIndex: null });
    }

    renderCover(i) {
        return (<div className="volume" key={i}>
                    <img src={`images/volume${i}_cover.png`} className="cover" onClick={e => { this.showModal(i) }} />
                    <a href={`downloads/volume${i}.zip`} className="download" download>
                        Download PDF
                    </a>
                </div>);
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

window.onload = function(e) {
    const domContainer = document.getElementById('volume_viewer');
    ReactDOM.render(React.createElement(VolumeViewer), domContainer);
}