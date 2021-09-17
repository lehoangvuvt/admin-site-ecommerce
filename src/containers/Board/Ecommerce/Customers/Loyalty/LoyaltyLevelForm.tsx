import { Accordion, AccordionDetails, AccordionSummary, TextField, Typography,Container,Button } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Delete from '@material-ui/icons/Delete'
import { CustomerLoyaltyLevelDTO } from "../../../../types";
import React, {useState, useImperativeHandle, forwardRef, useRef} from 'react';
import './style.scss'
import { NumberFormatCustom } from "../../../../../components/NumberFormatCustom";
import {ChromePicker, SketchPicker} from 'react-color'
import rgb from 'color-rgba'

interface IndexType extends CustomerLoyaltyLevelDTO{
    keytt: number;
    deleteFunc: (keyt: number) => void;
}

const LoyaltyLevelForm= React.forwardRef((props: IndexType, ref: React.Ref<any>) => {
    const {keytt, deleteFunc, ...item} = props;
    const [keyt, setKeyt] = useState<number>(keytt);
    const [name, setName] = useState<string>(item.NAME ? item.NAME : "");
    const [description, setDescription] = useState<string>(item.DESCRIPTION ? item.DESCRIPTION:"");
    const [lowRange, setLowRange] = useState<string>(item.LOW_RANGE ? item.LOW_RANGE.toString() : "");
    const [upperRange, setUpperRange] = useState<string>(item.UPPER_RANGE ? item.UPPER_RANGE.toString() : "");
    const [earnMultiplier, setEarnMultiplier] = useState<string>(item.EARN_MULTIPLIER ? item.EARN_MULTIPLIER.toString() : "");
    const [redeemMultiplier, setRedeemMultiplier] = useState<string>(item.REDEEM_MULTIPLIER ? item.REDEEM_MULTIPLIER.toString() :  "");
    const [colorR, setColor] = useState<string>(item.HEX_COLOR ? item.HEX_COLOR : "rgba(0,0,0,1)");
    const [displayColorPicker, setDisplayColorPicker] = useState<boolean>(false);

    useImperativeHandle(ref, () => ({
        getMyState: () => {
            // console.log(colorR);
            return {
                ID: keyt,
                NAME: name,
                DESCRIPTION: description,
                LOW_RANGE: parseInt(lowRange),
                UPPER_RANGE: parseInt(upperRange),
                EARN_MULTIPLIER: parseFloat(earnMultiplier),
                REDEEM_MULTIPLIER: parseFloat(redeemMultiplier),
                HEX_COLOR: colorR
            }
        },
        removeItem: (data: CustomerLoyaltyLevelDTO) => {
            setKeyt(data.ID);
            setName(data.NAME);
            setDescription(data.DESCRIPTION);
            setLowRange(data.LOW_RANGE.toString());
            setUpperRange(data.UPPER_RANGE.toString());
            setEarnMultiplier(data.EARN_MULTIPLIER.toString());
            setRedeemMultiplier(data.REDEEM_MULTIPLIER.toString());
            setColor(data.HEX_COLOR);
        }
    
    }), 
        
    );

    const deleteLoyaltyItem = (event: any) => {
        event.stopPropagation();
        deleteFunc(keyt);
    }

    const convert: any = (rgba: string) => {
        const rgbA = rgb(rgba);
        if (rgbA && rgbA.length === 4)
            return {
                r: rgbA[0],
                g: rgbA[1],
                b: rgbA[2],
                a: rgbA[3]
            }
        else return {
            r: 0,
            g: 0,
            b: 0,
            a: 1
        }
    }

    const handleChangeColor = (color:any, event: any) => {
        setColor(`rgba(${color.rgb.r},${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`);
    }

    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
            >
                <Container className="accordion-summary-div">
                    <div className="title-box">
                        <div className="box-color">
                            <div style={{backgroundColor: colorR}}/>
                        </div>
                        <Typography>{(name && name !== "") ? name: "New loyalty"}</Typography>
                    </div>
                    <Button onClick={deleteLoyaltyItem}>
                        <Delete />
                    </Button>
                </Container>
                
            </AccordionSummary>
            <AccordionDetails className="accordion-details">
                <div className="row">
                    <div className="column">
                        <TextField 
                            id="Name" 
                            label="Name" 
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="column">
                        <TextField 
                            id="Description" 
                            label="Description" 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="column"> 
                        <TextField 
                            // id="LowRange"
                            label="Low Range"
                            required
                            value={lowRange}
                            id={""}
                            InputProps={{
                                inputComponent: NumberFormatCustom as any
                            }}
                            onChange={(e) => setLowRange(e.target.value  )}
                        />
                    </div>
                    <div className="column">
                        <TextField 
                            id=""
                            label="Upper Range"
                            required
                            value={upperRange}
                            InputProps={{
                                inputComponent: NumberFormatCustom as any
                            }}
                            onChange={(e) => setUpperRange(e.target.value)}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="column"> 
                        <TextField 
                            id=""
                            label="Earn Multiplier"
                            required
                            value={earnMultiplier}
                            InputProps={{
                                inputComponent: NumberFormatCustom as any
                            }}
                            onChange={(e) => setEarnMultiplier(e.target.value)}
                        />
                    </div>
                    <div className="column">
                        <TextField 
                            id=""
                            label="Redeem Multiplier"
                            required
                            value={redeemMultiplier}
                            InputProps={{
                                inputComponent: NumberFormatCustom as any
                            }}
                            onChange={(e) => setRedeemMultiplier(e.target.value)}
                        />
                    </div>
                </div>
                <div className="row">
                    <Typography>Pick color</Typography>
                    <div>
                        <div className="box-color-in">
                            <div id="btnClr" style={{backgroundColor: colorR}} onClick={() => setDisplayColorPicker(!displayColorPicker)}/>
                            {
                                (displayColorPicker) && 
                                <div className="chrome-picker-style">
                                    <ChromePicker 
                                        color={convert(colorR)}
                                        onChange={handleChangeColor}
                                    />
                                </div>

                            }
                        </div>
                    </div>
                   
                    </div>
                
                
                
                

            </AccordionDetails>
        </Accordion>
    )
}
)

export default LoyaltyLevelForm;