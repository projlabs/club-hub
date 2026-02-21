"use client";

import styled from "styled-components";
import { useState } from "react";
import Image from "next/image";
import LoginIcon from "@mui/icons-material/LoginTwoTone";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import { useUser } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useClerk, useSignIn } from "@clerk/clerk-react";

import Logo from "./Logo";
import SearchBar from "./SearchBar";

export default function Navbar({}) {
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      fetch("/api/login/addToSupabase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  }, [isSignedIn]);

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <NavbarContainer>
      <Logo id="logo" />
      <SearchBar id="search-bar" />
      <span id="user-section">
        <SignedOut>
          <div style={{ display: "flex", gap: "10px" }}>
            <DemoLoginBtn />
            <LoginBtn id="login-btn" />
          </div>
        </SignedOut>
        <SignedIn>
          <Button
            onClick={(e) => {
              setAnchorEl(e.currentTarget);
            }}
          >
            <Image
              src={user?.imageUrl}
              alt="user"
              width={50}
              height={50}
              style={{ borderRadius: "50%" }}
            />
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem
              onClick={(e) => {
                e.preventDefault();
                router.push("/club-request");
                handleClose();
              }}
            >
              Create Club
            </MenuItem>
            <MenuItem
              onClick={() => {
                router.push("/admin");
                handleClose();
              }}
            >
              Approval List
            </MenuItem>
            <MenuItem
              onClick={() => signOut({ redirectUrl: "/" })}
              style={{ color: "red" }}
            >
              Logout
            </MenuItem>
          </Menu>
        </SignedIn>
      </span>
    </NavbarContainer>
  );
}

const NavbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px;

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    row-gap: 15px;

    #search-bar {
      grid-row: 2;
      grid-column: span 2;
      gap: 10px;
      justify-self: center;
    }

    #user-section {
      justify-self: end;
    }
  }
`;

function LoginBtn({ ...props }) {
  const clerk = useClerk();

  return (
    <BlueBtn type="button" onClick={() => clerk.openSignIn({})} {...props}>
      <LoginIcon /> Login
    </BlueBtn>
  );
}

function DemoLoginBtn({ ...props }) {
  const { isLoaded, signIn, setActive } = useSignIn();

  const handleDemoLogin = async () => {
    if (!isLoaded) return;
    
    try {
      const result = await signIn.create({
        identifier: "admin@demo.com",
        password: "admin12demo",
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
      }
    } catch (err) {
      alert("Admin Login Failed");
    }
  };

  return (
    <BlueBtn 
      type="button" 
      onClick={handleDemoLogin} 
      style={{ backgroundColor: "#10b981", maxWidth: "none" }} 
      {...props}
    >
      <LoginIcon /> Admin
    </BlueBtn>
  );
}

const BlueBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000a3e;
  border: none;
  border-radius: 15px;
  color: white;
  padding: 5px 10px;
  gap: 5px;
  cursor: pointer;
  max-width: 100px;
`;
