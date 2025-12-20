'use client';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import { Settings } from 'react-slick';
import { Box } from '@mui/material';
import Button from '@mui/material/Button/Button';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Divider from '@mui/material/Divider';
import Link from 'next/link';

interface IProps {
    title: string;
    data: ITrackTop[];
}

const MainSlider = (props: IProps) => {
    const { title, data } = props;

    const NextArrow = (props: any) => {
        return (
            <Button
                variant="contained"
                color="inherit"
                onClick={props.onClick}
                sx={{
                    position: 'absolute',
                    right: 25,
                    top: '25%',
                    zIndex: 2,
                    minWidth: 30,
                    width: 35,
                }}
            >
                <ChevronRightIcon />
            </Button>
        );
    };

    const PrevArrow = (props: any) => {
        return (
            <Button
                variant="contained"
                color="inherit"
                onClick={props.onClick}
                sx={{
                    position: 'absolute',
                    top: '25%',
                    zIndex: 2,
                    minWidth: 30,
                    width: 35,
                }}
            >
                <ChevronLeftIcon />
            </Button>
        );
    };

    const settings: Settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };
    //box === div

    return (
        <Box
            sx={{
                margin: '0 50px',
                '& a': {
                    textDecoration: 'none', // Bỏ gạch chân
                    color: 'inherit',       // Bỏ màu xanh mặc định của Link, dùng màu của text cha
                },
                '.track': {
                    padding: '0 10px',
                    img: {
                        height: 150,
                        width: 150,
                    },
                },
                h3: {
                    border: '1px solid #ccc',
                    padding: '20px',
                    height: '200px',
                },
            }}
        >
            <h2>{title}</h2>

            <Slider {...settings}>
                {data.map((track) => (
                    <Link href={`track/${track._id}?audio=${track.trackUrl}&id=${track._id}`} className="track" key={track._id}>
                        <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`} />
                        <h4>{track.title}</h4>
                        <h5>{track.description}</h5>
                    </Link>
                ))}
            </Slider>
            <Divider />
        </Box>
    );
};

export default MainSlider;
