import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link} from "@nextui-org/react";

const navheader=[
  // {label:'Dashboard',path:'/project-rizki', },
  {label:'Pokemon Name',path:'/project-rizki/t1'},
  {label:'Pokemon Type',path:'/project-rizki/t2'},
  {label:'Pokemon Ability',path:'/project-rizki/t3'},
  {label:'Pokemon',path:'/project-rizki/t4'},
  // {label:'Pokedex',path:'/project-rizki/t5'},
]
export const mynavbar=<><Navbar position="static" isBordered >
                      <NavbarBrand>
                        <Link href="./dashboard" color="foreground">
                            PokeAPI
                        </Link>
                        {/* <p className="font-bold text-inherit"></p> */}
                      </NavbarBrand>
                      <NavbarContent className="hidden flex gap-4" justify="end">
                        <NavbarItem>
                          <Link color="foreground" href="pokedex">
                            Pokedex
                          </Link>
                        </NavbarItem>
                        <NavbarItem>
                          <Link href="reg-pokemon" color="foreground">
                            Registered Pokemon
                          </Link>
                        </NavbarItem>
                        <NavbarItem>
                          <Link color="foreground" href="pokemon-name">
                            Pokemon Name
                          </Link>
                        </NavbarItem>
                        <NavbarItem>
                          <Link color="foreground" href="pokemon-type">
                            Type
                          </Link>
                        </NavbarItem>
                        <NavbarItem>
                          <Link color="foreground" href="pokemon-ability">
                            Ability
                          </Link>
                        </NavbarItem>
                      </NavbarContent>
                    </Navbar></>
export const mynavbar2=<Navbar position="static">
{/* <NavbarBrand>
  <AcmeLogo />
  <p className="font-bold text-inherit">ACME</p>
</NavbarBrand> */}
<NavbarContent className="hidden sm:flex gap-4" justify="center">
  {[...Array(navheader.length)].map((e,i)=>(
    <NavbarItem key={i}>
      <Link color="foreground" href={navheader[i].path}>
        {navheader[i].label}
      </Link>
    </NavbarItem>
  ))}
</NavbarContent>
</Navbar>