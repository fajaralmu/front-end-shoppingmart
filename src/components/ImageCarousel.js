import React, { Component } from 'react'
import '../css/Common.css'
import '../css/ImageCarousel.css' 
import InstantTable from '../components/container/InstantTable';
import Label from './Label';
import ActionButton from './buttons/ActionButton';

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
        if (this.props.imageUrls) {
            for (let index = 0; index < this.props.imageUrls.length; index++) {
                const imageUrl = this.props.imageUrls[index];
                if (index == this.state.index) {
                    image = <img src={imageUrl} className="carousel-item" />
                }
            }
        }
        return (
            <div className="carousel rounded"> 
                {image}
                <InstantTable className="carousel-navigation" rows={[{
                    values: [
                        <ActionButton text="<" id="btn-prev" onClick={this.prev} />,
                        <Label text={this.state.index + 1 + "/" + (this.props.imageUrls ? this.props.imageUrls.length : 1)} />,
                        <ActionButton text=">" id="btn-next" onClick={this.next} />
                    ]
                }]} />


            </div>
        )
    }
}

export default ImageCarousel;