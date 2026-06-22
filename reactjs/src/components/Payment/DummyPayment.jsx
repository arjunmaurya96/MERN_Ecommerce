import React, { useState } from "react";
import toast from "react-hot-toast";

const DummyPaymentModal = ({ amount, onClose, onSuccess }) => {
  const [method, setMethod] = useState("CARD");
  const [card, setCard] = useState({
    number: "",
    expiry: "",
    cvv: "",
  });

  const handlePay = () => {
    // ✅ SUCCESS RULE
    if (method === "CARD") {
      if (!card.number.endsWith("4242")) {
        toast.error("Payment failed ❌");
        return;
      }
    }

    toast.success("Payment successful ✅");
    setTimeout(onSuccess, 800);
  };

  return (
    <div className="modal fade show d-block bg-dark bg-opacity-50">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">Secure Payment</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <h6 className="mb-3">Amount: ₹{amount}</h6>

            {/* ================= METHOD ================= */}
            <div className="mb-3">
              <select
                className="form-select"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                <option value="CARD">Credit / Debit Card</option>
                <option value="UPI">UPI</option>
              </select>
            </div>

            {/* ================= CARD ================= */}
            {method === "CARD" && (
              <>
                <input
                  className="form-control mb-2"
                  placeholder="Card Number"
                  onChange={(e) =>
                    setCard({ ...card, number: e.target.value })
                  }
                />
                <input
                  className="form-control mb-2"
                  placeholder="Expiry MM/YY"
                  onChange={(e) =>
                    setCard({ ...card, expiry: e.target.value })
                  }
                />
                <input
                  className="form-control"
                  placeholder="CVV"
                  onChange={(e) =>
                    setCard({ ...card, cvv: e.target.value })
                  }
                />
                <small className="text-muted">
                  Use card ending with <b>4242</b> for success
                </small>
              </>
            )}

            {/* ================= UPI ================= */}
            {method === "UPI" && (
              <input
                className="form-control"
                placeholder="example@upi"
              />
            )}
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handlePay}>
              Pay Now
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DummyPaymentModal;
