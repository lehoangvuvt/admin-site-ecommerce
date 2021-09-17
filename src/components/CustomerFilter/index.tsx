import { Paper, Typography, Button, TextField, MenuItem, Menu } from '@material-ui/core'
import { Close } from '@material-ui/icons'
import { useState, forwardRef, useRef, useImperativeHandle, useEffect } from 'react'

type IndexType = {
    setOpenModal: (vari: boolean) => void;
    listColumn: string[];
    handleSaveFilter: (filter:string) => void;
    filterStr?: string;
}

interface CompareComponentType extends CompareMethod {
    keyt: number;
    listColumn: string[];
    handleDelete: (keyt: number) => void;
}

interface CompareMethod {
    name: string;
    operator: string;
    value: string;
    next: string;
}

const CompareComponent = forwardRef((props: CompareComponentType, ref: React.Ref<any>) => {
    const [name, setName] = useState<string>(props.name);
    const [operator, setOperator] = useState<string>(props.operator);
    const [value, setValue] = useState<string>(props.value);
    const [next, setNext] = useState<string>(props.next);

    useEffect(() => {
        setName(props.name);
        setOperator(props.operator);
        setValue(props.value);
        setNext(props.next);
    }, [])

    useImperativeHandle(ref, () => ({
        getCompare: () => {
            return {
                name,
                operator,
                value,
                next
            }
        }
    }))

    return (
        <div className="compare-component">
            <Typography variant="body1" color="primary">{(next === '1') ? 'And' : ((next === '2') ? 'Or' : '')}</Typography>
            <TextField
                id=""
                label="Column"
                select
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="name-field"
            >
                {
                    props.listColumn.map((item: any) => (
                        <MenuItem key={item} value={item}>{item}</MenuItem>
                    ))
                }
            </TextField>
            <TextField
                id=""
                label="Operator"
                select
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                className="operator-field"
            >
                <MenuItem key="1" value="1">
                    Equal
                </MenuItem>
                <MenuItem key="2" value="2">
                    Not Equal
                </MenuItem>
                <MenuItem key="3" value="3">
                    Contain
                </MenuItem>
            </TextField>
            <TextField
                id=""
                label="Value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="value-field"
            />
            {
                (props.keyt > 0) && (
                <Button onClick={() => props.handleDelete(props.keyt)}>
                    <Close />
                </Button>
                )
            }
        </div>
    )
})

const CustomerFilter: React.FC<IndexType> = ({ setOpenModal, handleSaveFilter, listColumn, filterStr }) => {
    const [lstCompare, setLstCompare] = useState<CompareMethod[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const itemsRef = useRef(new Array(lstCompare.length));

    useEffect(() => {
        if (filterStr) {
            let i: number = 0;
            let name: string = "";
            let operator: string = "";
            let value: string = "";
            let next: string = "";
            let lstCompareTemp: CompareMethod[] = [];
            while (i < filterStr.length) {
                while (i < filterStr.length && filterStr[i] === ' ') i+=1;
                let k: number = i;
                while (k < filterStr.length && filterStr[k] !== '(') k+=1;
                let nextStr: string = filterStr.substring(i,k);
                if (nextStr === 'and') next = '1';
                else if (nextStr === 'or') next = '2';
                i = k;
                if (filterStr[i] === '(') {
                    i+=1;
                    let j: number = i;
                    while (j < filterStr.length && filterStr[j] !== ' ') j+=1;
                    name = filterStr.substring(i,j);
                    j += 1;
                    i = j;
                    while (j < filterStr.length && filterStr[j] !== ' ') j += 1;
                    let operatorStr: string = filterStr.substring(i,j);
                    if (operatorStr === '=') operator = '1';
                    else if (operatorStr === '<>') operator = '2';
                    else if (operatorStr === 'like') operator = '3';
                    j += 2;
                    i = j;
                    while (j < filterStr.length && filterStr[j] !== "'") j += 1;
                    value = filterStr.substring(i,j);
                    if (filterStr[j+1] !== ')')
                        return;
                    i = j + 2;
                }
                lstCompareTemp.push({
                    name,
                    operator,
                    value,
                    next
                })
            }
            setLstCompare(lstCompareTemp);
        }
        else setLstCompare([{name: "", operator: "1", value: "", next: ""}]);
    }, [])

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (k: string) => {
        setAnchorEl(null);
        let tmpObj: CompareMethod = {
            name: "",
            operator: "1",
            value: "",
            next: k
        }
        setLstCompare(lstCompare => [...lstCompare, tmpObj])
    };

    const handleDelete = (keyt: number) => {
        setLstCompare(lstCompare.filter((item,index) => index !== keyt)) 
    }

    const handleSave = () => {
        let tempSave: CompareMethod[] = [];
        itemsRef.current.map(item => {
            if (!item) return;
            tempSave.push(item.getCompare());
        })
        let filter: string = "";
        tempSave.map((item,index) => {
            if (index > 0) filter += (item.next === '1') ? 'and' : 'or';
            let operator = '';
            if (item.operator === '1') operator = '=';
            else if (item.operator === '2') operator = '<>';
            else if (item.operator === '3') operator = 'like'
            filter += `(${item.name} ${operator} '${item.operator==='3'?'%':''}${item.value}${item.operator==='3'?'%':''}')`;
        })
        handleSaveFilter(filter);
        setOpenModal(false);
    }

    return (
        <Paper className="paper">
            <div className="title-modal">
                <div className="heading-modal">
                    <Typography variant="h5">Edit Customer Filter</Typography>
                    <Button variant="contained" color="primary" style={{ height: 'fit-content' }} onClick={handleClick}>Add</Button>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={() => handleClose('1')} value="1">And</MenuItem>
                        <MenuItem onClick={() => handleClose('2')} value="2">Or</MenuItem>
                    </Menu>
                </div>
                <Button onClick={(e) => setOpenModal(false)}>
                    <Close />
                </Button>
            </div>
            <div className="body-modal">
                {
                    lstCompare.map((item, index) => (
                        <CompareComponent ref={(element: any) => itemsRef.current[index] = element} key={index} keyt={index} {...item} listColumn={listColumn} handleDelete={handleDelete} />
                    ))
                }
            </div>
            <div className="footer-modal">
                <Button variant="contained" color="primary" onClick={() => handleSave()}>Save</Button>
            </div>
        </Paper>
    )
}

export default CustomerFilter;