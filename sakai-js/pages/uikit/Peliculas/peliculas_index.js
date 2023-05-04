import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { Rating } from 'primereact/rating';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { useRouter } from 'next/router';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { ProductService } from '../../../demo/service/ProductService';
//Importo la url de la api
import Global from '../../api/Global';
import { useRouter } from 'next/router';

const Peliculas = () => {
    let emptyPeli = {
        peli_Id: null, 
        peli_Titulo: '', 
        peli_TitulOriginal: '', 
        peli_AnioEstreno: null, 
        peli_Duracion: null, 
        cate_Nombre: '', 
        Dire_Nombre: ''
    };

    //products son los datos
    const [peliculas, setPeliculas] = useState([]);

    //Ni idea aun
    const [products, setProducts] = useState(null);

    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    //es mi model
    const [product, setProduct] = useState(emptyProduct);

    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    //Buscar
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);

    //el ProductService esta trallendo los datos de los productos
    useEffect(() => {
        fetch(Global.url + '')
            .then(response => response.json())
            .then(data => setEmpleados(data))
            .catch(error => console.error(error));
    }, []);

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

     //abre el modal
     const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    //Guarda los datos
    const saveProduct = () => {
        setSubmitted(true);

        if (product.name.trim()) {
            let _products = [...products];
            let _product = { ...product };
            if (product.id) {
                const index = findIndexById(product.id);

                _products[index] = _product;
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
            } else {
                _product.id = createId();
                _product.code = createId();
                _product.image = 'product-placeholder.svg';
                _products.push(_product);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
            }

            setProducts(_products);
            setProductDialog(false);
            setProduct(emptyProduct);
        }
    };

    const editProduct = (product) => {
        setProduct({ ...product });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        let _products = products.filter((val) => val.id !== product.id);
        setProducts(_products);
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
    };

    //Busca por el index
    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };
 

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = () => {
        let _products = products.filter((val) => !selectedProducts.includes(val));
        setProducts(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    };

    const onCategoryChange = (e) => {
        let _product = { ...product };
        _product['peli_Titulo'] = e.value;
        setProduct(_product);
    };

    const onInputChange = (e, peli_Titulo) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };
        _product[`${peli_Titulo}`] = val;

        setProduct(_product);
    };

    const onInputNumberChange = (e, peli_Titulo) => {
        const val = e.value || 0;
        let _product = { ...product };
        _product[`${peli_Titulo}`] = val;

        setProduct(_product);
    };

    const router = useRouter();

    // ACÁ COLOCAR LA RUTA PARA REDIRIGIR PARA AÑADIR UNA NUEVA PELI
    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                      <Button label="Nuevo" icon="pi pi-plus" severity="sucess" className="mr-2" onClick={() => router.push('')} /> 

                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} />
                </div>
            </React.Fragment>
        );
    };

    //redimenciona la  imagen
    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Import" chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    //Comienzo de el head de la tabla
    const idBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Id</span>
                {rowData.peli_Id}
            </>
        );
    };

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Título</span>
                {rowData.peli_Titulo}
            </>
        );
    };

    const ognameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Título Original</span>
                {rowData.peli_TitulOriginal}
            </>
        );
    };
    const añoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Año Estreno</span>
                {rowData.peli_AñoEstreno}
            </>
        );
    };
    const duracionBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Duración (mins)</span>
                {rowData.peli_Duracion}
            </>
        );
    };

    const directorBodyTemplate = (rowData) => {
        return(
            <>
            <span className="p-column-title">Director</span>
            {rowData.peli_Categoria}
            </>
        );
    };

    const categoriaBodyTemplate = (rowData) => {
        return(
            <>
            <span className="p-column-title">Categoría</span>
            {rowData.peli_Categoria}
            </>
        )
    }
     
    
    //Finall de la heda de la tabla

    const statusBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                <span className={`product-badge status-${rowData.inventoryStatus.toLowerCase()}`}>{rowData.inventoryStatus}</span>
            </>
        );
    };

    //Botones de editar y eliminar
    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" severity="success" rounded className="mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" severity="warning" rounded onClick={() => confirmDeleteProduct(rowData)} />
            </>
        );
    };

    

    //Titulo de mi Tabla
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Peliculas</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
 
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveProduct} />
        </>
    );
    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteProduct} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedProducts} />
        </>
    );
    
    //cambiar los campos en FIELD: peli_Categoria
    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                         value={peliculas}
                         selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        globalFilter={globalFilter}
                        emptyMessage="No hay Peliculas."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="ID" header="ID" sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="Título" header="Título" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="Título Original" header="Título Original" sortable body={ognameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="Año Estreno" header="Año Estreno" sortable body={añoBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="Duración (mins)" header="Duración (mins)" sortable body={duracionBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="Director" header="Director" sortable body={directorBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="Categoria" header="Categoria" sortable body={categoriaBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                     <Dialog visible={productDialog} style={{ width: '450px' }} header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        {product.image && <img src={`/demo/images/product/${product.image}`} alt={product.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText id="name" value={product.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} />
                            {submitted && !product.name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputTextarea id="description" value={product.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                        </div>

                        <div className="field">
                            <label className="mb-3">Category</label>
                            <div className="formgrid grid">
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category1" name="category" value="Accessories" onChange={onCategoryChange} checked={product.category === 'Accessories'} />
                                    <label htmlFor="category1">Accessories</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category2" name="category" value="Clothing" onChange={onCategoryChange} checked={product.category === 'Clothing'} />
                                    <label htmlFor="category2">Clothing</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category3" name="category" value="Electronics" onChange={onCategoryChange} checked={product.category === 'Electronics'} />
                                    <label htmlFor="category3">Electronics</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category4" name="category" value="Fitness" onChange={onCategoryChange} checked={product.category === 'Fitness'} />
                                    <label htmlFor="category4">Fitness</label>
                                </div>
                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="price">Price</label>
                                <InputNumber id="price" value={product.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="USD" locale="en-US" />
                            </div>
                            <div className="field col">
                                <label htmlFor="quantity">Quantity</label>
                                <InputNumber id="quantity" value={product.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} integeronly="true" />
                            </div>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && (
                                <span>
                                    Are you sure you want to delete <b>{product.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && <span>Are you sure you want to delete the selected products?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Peliculas;