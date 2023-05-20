import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  Box,
} from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import React, { Fragment, useEffect } from "react";
import { useState } from "react";
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { Link, useNavigate } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { addToWishlist } from "../../apiCalls/userApiCalls";


const Cards = (props) => {


const [error, setError] = useState(false);
const [loading, setLoading] = useState(false);


const user = useSelector((state) => state.userLogin);
const token = user?.userInfo?.token;






  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleMouseEnter = (value) => {
    setHoveredIndex(value);
    console.log(props.isSmall);
  };
  

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };
//////////////////wishlist/////////////////////

    const handleAddToWishList = async (productId) => {
      try {
        setLoading(true);
        const result = await addToWishlist(token, productId);

        // console.log("blocksucess2");

        if (result.data) {
          console.log("test 4 ");
          console.log(result.data);
          toast.success("Added To WishList");
          setLoading(false);
        } else {
          setError(true);
          setTimeout(() => {
            setError(false);
          }, 4000);
          toast.error(result);
        }
      } catch (error) {
        // setLoading(false);
        console.log(error.message);
      }
    };
////////////////////////////////////////////

    const [search, setSearch] = useState("");

 const navigate = useNavigate()

  useEffect(()=>{
    console.log(props);
  })

  return (
    <Fragment>
      <Box sx={{ minHeight: "100vh" }}>
        <Box
          maxWidth
          sx={{
            bgcolor: "#E9E8E8",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 4, // added padding on left and right
          }}
        >
          <Typography
            variant="h4"
            fontWeight={{ xs: 400, sm: 500, md: 600, lg: 800 }}
            my={{ xs: 0.5, sm: 1, md: 1.6, lg: 2 }}
            sx={{
              fontFamily: "Inria Serif",
              color: "primary.main",
              textAlign: "center",
              flexGrow: 1,
            }}
          >
            New Arrivals
            {props.text}
          </Typography>
          {props.isShop ? (
            <Paper
              component="form"
              sx={{
                p: "1px 4px",
                display: "flex",
                alignItems: "center",
                width: 200,
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search"
                inputProps={{ "aria-label": "search google maps" }}
                onChange={(e) => setSearch(e.target.value)}
              />
              <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
                <SearchIcon />
              </IconButton>
              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            </Paper>
          ) : (
            ""
          )}
        </Box>

        <Grid container sx={{ justifyContent: "center", marginTop:6 }}>
          {props.products
            ?.filter(
              (product) =>
                product.isVerified &&
                !product.isBlocked &&
                product.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((product) => {
              return (
                <Grid
                  xs={12}
                  sm={6}
                  lg={3}
                  item
                  key={product._id}
                  // sx={{ borderRadius: 5 }}
                >
                  <Card
                    key={product._id}
                    onMouseEnter={() => handleMouseEnter(product._id)}
                    onMouseLeave={handleMouseLeave}
                    sx={{
                      //  justifyItems:"center",
                      //  justifyContent:"center",
                      // alignItems:"center",

                      ...props.shopCards,
                      ...props.homeCards,
                    }}
                  >
                    <CardMedia
                      image={product.image[0].url}
                      sx={{
                        // height: { xs: 200, sm: 250 },
                        opacity: hoveredIndex === product._id ? 0.5 : 1,
                        width: "15rem",
                        height: "80%",
                      }}
                    />

                    {hoveredIndex === product._id && (
                      <CardActions>
                        <Button
                          variant="contained"
                          color="primary"
                          style={{
                            position: "absolute",
                            top: "90%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                          }}
                          onClick={() => {
                            navigate(`/singleproduct/${product._id}`);
                          }}
                        >
                          View
                        </Button>
                        <FavoriteBorderIcon
                          style={{
                            position: "absolute",
                            top: "6%",
                            right: "0%",
                            transform: "translate(-50%, -50%)",
                          }}
                          onClick={() => {
                            handleAddToWishList(product._id);
                          }}
                        />
                      </CardActions>
                    )}
                    <CardContent sx={{ height: "20%" }}>
                      <Typography
                        color="primary"
                        variant="h6"
                        fontWeight={{ xs: 550 }}
                      >
                        {product.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          {props.products?.filter(
            (product) =>
              product.isVerified &&
              product.isBlocked &&
              product.name.toLowerCase().includes(search.toLowerCase())
          ).length === 0 && (
            <Typography variant="h6" color={"primary.main"} sx={{ my: "28vh" }}>
              {search} not available
            </Typography>
          )}
        </Grid>
      </Box>
    </Fragment>
  );
};

export default Cards;
