import React, { Component } from 'react' 
import './ImageCarousel.css' 
import InstantTable from './InstantTable';
import Label from './Label';
import ActionButton from '../buttons/ActionButton';

class ImageCarousel extends Component {
    constructor(props) {
        super(props);
        this.state = { index: 0 }
        this.prev = () => {
            if (this.props.imageUrls == null) return;
            let currentIndex = this.state.index;
            if (currentIndex <= 0)
                currentIndex = this.props.imageUrls.length - 1;
            else
                currentIndex--;
            this.setState({ index: currentIndex })
        }

        this.next = () => {
            if (this.props.imageUrls == null) return;
            let currentIndex = this.state.index;
            if (currentIndex >= this.props.imageUrls.length - 1)
                currentIndex = 0;
            else
                currentIndex++;
            this.setState({ index: currentIndex })

        }
    }

    render() {
        let image = "";
        let bgUrl = null;
        if (this.props.imageUrls) {
           
            for (let i = 0; i < this.props.imageUrls.length; i++) {
                const imageUrl = this.props.imageUrls[i];
                console.debug(i, "this.state.index: ",this.state.index, "Image carousel URL", imageUrl);
                if (i == this.state.index) {
                    image = <img src={imageUrl} className="carousel-item" />
                    bgUrl = imageUrl;
                }
            }
        }
        return (
            <div className="carousel rounded" style={{
                backgroundImage: 'url('+bgUrl+')',
                backgroundSize: '400px 300px'
            }}> 
                 
                <InstantTable style={{backgroundColor:'rgba(150,150,150,0.5'}} className="carousel-navigation" rows={[{
                    values: [
                        <ActionButton text={<i className="fas fa-chevron-left"></i>} id="btn-prev-img" onClick={this.prev} />,
                        <Label text={this.state.index + 1 + "/" + (this.props.imageUrls ? this.props.imageUrls.length : 1)} />,
                        <ActionButton text={<i className="fas fa-chevron-right"></i>} id="btn-next-img" onClick={this.next} />
                    ]
                }]} />
            </div>
        )
    }
}

export default ImageCarousel;