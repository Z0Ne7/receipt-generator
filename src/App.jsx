import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";
import { capitalizeFirstLetter, getItem, setItem, to_vietnamese } from "./utils/localStorageHelper";
import NumberFormat from "react-number-format";

function App() {
  const [customerName, setCustomerName] = useState(getItem("customerName") || "");
  const [customerPhone, setCustomerPhone] = useState(getItem("customerPhone") || "");
  const [customerAddress, setCustomerAddress] = useState(getItem("customerAddress") || "");
  const [productName, setProductName] = useState("");
  const [unit, setUnit] = useState("Chiếc");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("0");
  const [productList, setProductList] = useState(JSON.parse(getItem("productList")));
  const [productListTable, setProductListTable] = useState(JSON.parse(getItem("productListTable")));
  const [owner, setOwner] = useState("1");
  const [deleteProduct, setDeleteProduct] = useState("0");
  const ownerList = [
    { name: "Huế", value: 1 },
    { name: "Dinh", value: 2 },
  ];
  const handleAddProduct = () => {
    if (productName === "") return;
    const item = {
      id: uuidv4(),
      name: productName,
    };
    const currentList = getItem("productList");
    if (!currentList) {
      setProductList([item]);
      setItem("productList", JSON.stringify([item]));
    } else {
      const currentListArr = JSON.parse(currentList);
      currentListArr.push(item);
      setProductList(currentListArr);
      setItem("productList", JSON.stringify(currentListArr));
    }
    setProductName("");
  };
  const handleDeleteProduct = (id) => {
    const currentList = JSON.parse(getItem("productList"));
    const newList = currentList.filter((item) => item.id !== id);
    setProductList(newList);
    setItem("productList", JSON.stringify(newList));
  };
  const handleAddProductTable = () => {
    if (selectedProduct === "0" || !unit || !quantity || !price) return;
    const item = {
      id: uuidv4(),
      productName: getProductName(selectedProduct),
      unit,
      quantity,
      price,
      totalPrice: +quantity * +price,
    };
    const currentList = getItem("productListTable");
    if (!currentList) {
      setProductListTable([item]);
      setItem("productListTable", JSON.stringify([item]));
    } else {
      const currentListArr = JSON.parse(currentList);
      currentListArr.push(item);
      setProductListTable(currentListArr);
      setItem("productListTable", JSON.stringify(currentListArr));
    }
    setSelectedProduct("0");
    setUnit("");
    setQuantity("");
    setPrice("");
  };
  const getProductName = (id) => {
    const foundItem = productList.find((item) => item.id === id);
    return foundItem?.name;
  };
  const getTotalValue = (field) => {
    const initialValue = 0;
    const sum = productListTable?.reduce((prev, current) => {
      return prev + +current[field];
    }, initialValue);
    return sum;
  };
  const handleSaveInfo = (e) => {
    const { name, value } = e.target;
    setItem(name, value);
  };
  const handleDeleteProductTable = () => {
    if (deleteProduct === "0") return;
    const currentList = JSON.parse(getItem("productListTable"));
    const newList = currentList.filter((item) => item.id !== deleteProduct);
    setProductListTable(newList);
    setItem("productListTable", JSON.stringify(newList));
    setDeleteProduct("0");
  };
  return (
    <div className="App flex">
      <div className="result-page flex flex-col" style={{ width: "70%" }}>
        <div className="header flex flex-col justify-center items-center">
          <span>CÔNG TY TNHH THƯƠNG MẠI TAD VIỆT NAM</span>
          <span>Địa chỉ: số 28 TT25, KĐT Văn Phú, Hà Đông, Hà Nội</span>
          <span>Hotline: 0981.708.178/ 0962.496.058</span>
        </div>
        <div className="title self-center">HÓA ĐƠN BÁN HÀNG</div>
        <div className="customer-info flex flex-col">
          <span className="name">Khách hàng: {customerName}</span>
          <span className="phone-number">SĐT: {customerPhone}</span>
          <span className="address">Địa chỉ: {customerAddress}</span>
        </div>
        <div className="product-table">
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên sản phẩm</th>
                <th>ĐVT</th>
                <th>SL</th>
                <th>Đơn giá</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {productListTable?.map((item, i) => (
                <tr key={item.id}>
                  <td>{i + 1}</td>
                  <td style={{ textAlign: "start" }}>{item.productName}</td>
                  <td>{item.unit}</td>
                  <td>{item.quantity}</td>
                  <td>
                    <NumberFormat
                      value={item.price}
                      displayType={"text"}
                      thousandSeparator="."
                      decimalSeparator=","
                    />
                  </td>
                  <td>
                    <NumberFormat
                      value={item.totalPrice}
                      displayType={"text"}
                      thousandSeparator="."
                      decimalSeparator=","
                    />
                  </td>
                </tr>
              ))}
              <tr style={{ fontWeight: "bold" }}>
                <td></td>
                <td style={{ textAlign: "start" }}>Tổng</td>
                <td></td>
                <td>{getTotalValue("quantity")}</td>
                <td></td>
                <td>
                  <NumberFormat
                    value={getTotalValue("totalPrice")}
                    displayType={"text"}
                    thousandSeparator="."
                    decimalSeparator=","
                    suffix="₫"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="footer flex flex-col">
          <div className="price-in-text">
            Bằng chữ: {capitalizeFirstLetter(to_vietnamese(+getTotalValue("totalPrice")))} đồng
          </div>
          <div className="note flex flex-col">
            <span>Ghi chú: Giá chưa bao gồm phí vận chuyển</span>
            <span>- Bánh thêm trứng muối +5k/1 bánh</span>
            <span>- Khách hàng vui lòng đặt cọc 50% đơn hàng</span>
            <span>- Thời gian đặt hàng 20 ngày kể từ ngày khách hàng đặt cọc</span>
          </div>
          <div className="bank-info flex flex-col">
            <span>Thông tin chuyển khoản</span>
            <span>Số tài khoản: {owner === "1" ? "19033887745011" : "19030019050014"}</span>
            <span>
              Chủ tài khoản: {owner === "1" ? "Bùi Thị Phương Huế" : "Bùi Thị Phương Dinh"}
            </span>
            <span>Ngân hàng Techcombank chi nhánh Phạm Văn Đồng</span>
          </div>
        </div>
      </div>
      <div className="tool-page flex flex-col">
        <div className="customer-management flex flex-col" style={{ gap: "10px" }}>
          <div className="add-name flex">
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Nhập tên khách hàng"
              name="customerName"
            />
            <button name="customerName" onClick={handleSaveInfo} value={customerName}>
              Save
            </button>
          </div>
          <div className="add-phone flex">
            <input
              type="text"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="Nhập số điện thoại"
              name="customerPhone"
            />
            <button name="customerPhone" onClick={handleSaveInfo} value={customerPhone}>
              Save
            </button>
          </div>
          <div className="add-address flex">
            <input
              type="text"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              placeholder="Nhập địa chỉ"
              name="customerAddress"
            />
            <button name="customerAddress" onClick={handleSaveInfo} value={customerAddress}>
              Save
            </button>
          </div>
        </div>
        <div className="product-management flex">
          <div className="add-product">
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Nhập tên sản phẩm"
            />
            <button onClick={handleAddProduct}>Add</button>
          </div>
          <div className="product-list">
            {productList?.map((item, i) => (
              <div className="flex" key={i}>
                <span style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {item.name}
                </span>
                <button onClick={() => handleDeleteProduct(item.id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
        <div className="product-table flex">
          <div className="add-product-table">
            <div className="input-item">
              <label htmlFor="">Sản phẩm</label>
              <select
                name="productList"
                onChange={(e) => setSelectedProduct(e.target.value)}
                value={selectedProduct}
                style={{maxWidth: "150px"}}
              >
                <option value="0" disabled>
                  Chọn sản phẩm
                </option>
                {productList?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-item">
              <label htmlFor="">Đơn vị tính</label>
              <input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} />
            </div>
            <div className="input-item">
              <label htmlFor="">Số lượng</label>
              <input
                type="number"
                name=""
                id=""
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="input-item">
              <label htmlFor="">Đơn giá</label>
              <input
                type="number"
                name=""
                id=""
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <button onClick={handleAddProductTable}>Thêm vào hóa đơn</button>
            <div className="input-item">
              <label
                htmlFor=""
                style={{ color: "#cd1818", textTransform: "uppercase", fontWeight: "bold" }}
              >
                Xóa sản phẩm
              </label>
              <select
                name="productListTable"
                onChange={(e) => setDeleteProduct(e.target.value)}
                value={deleteProduct}
              >
                <option value="0" disabled>
                  Chọn sản phẩm cần xóa
                </option>
                {productListTable?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.productName}
                  </option>
                ))}
              </select>
              <button onClick={handleDeleteProductTable} style={{ color: "red" }}>
                Xóa
              </button>
            </div>
          </div>
        </div>
        <div className="flex">
          <label htmlFor="">Người lập phiếu</label>
          <select name="ownerList" onChange={(e) => setOwner(e.target.value)} value={owner}>
            {ownerList?.map((item) => (
              <option key={item.value} value={item.value}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default App;
